import './PostFormFields.css'

import { useCallback, useEffect } from "react";
import { useCreateErrorFromResponse } from "../hooks/CreateErrorFromResponse";
import { useShowErrorMessage } from "../hooks/ShowErrorMessage";

/**
 * 投稿作成（もしくは編集）画面の入力画面
 * @param {String} formTitle フォームのタイトル
 * @param {String} post 投稿の内容（title,content,imageUrlが格納されている値）
 * @param {Function} onSubmit フォームを送信するボタンクリック時の関数
 * @param {String} buttonLabel フォームを送信するボタンに表示する文字列
 * @returns 
 */
function PostFormFields({ formTitle, post, setPost, onSubmit, buttonLabel }) {
    const { userInfo, isUserInfoLoading } = useUser();
    const [ages, setAges] = useState([]);
    const showErrorMessage = useShowErrorMessage();
    const createErrorFromResponse = useCreateErrorFromResponse();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prevPost => ({ ...prevPost, [name]: value }));
    }

    /**
     * ほかの犬の画像を表示するボタンがクリックされたときの処理
     */
    const handleButtonClick = useCallback(async () => {
        try {
            const response = await fetch("https://dog.ceo/api/breeds/image/random");
            if (response.ok) {
                const data = await response.json();
                setPost(prevPost => ({ ...prevPost, imageUrl: data.message }));
            } else {
                createErrorFromResponse(response);
            }
        } catch (error) {
            showErrorMessage(error);
        }
    }, [createErrorFromResponse, showErrorMessage]);

    useEffect(() => {
        // 年齢を取得する
        const fetchAges = async () => {
            const data = await getAges();
            if (data) {
                setAges(data);
            }
        }
        fetchAges();

        // 投稿の画像のURLが設定されていない場合、ほかの犬の画像を表示するボタンがクリックされたときの処理を実行して
        if (!post?.imageUrl) {
            const getImageUrl = async () => {
                await handleButtonClick();
            }
            getImageUrl();
        }

    }, [handleButtonClick, post?.imageUrl, getAges]);

    // ユーザー情報の読み込み途中の場合何も表示しない。
    if(isUserInfoLoading){
        return null;
    }

    // 情報が存在しない（ログインしていない）場合、その旨を表示して一覧表示画面へ遷移する
    // 白い画面上にメッセージが表示される動きとなる。URLが直接入力されない限りあり得ないためこの通りのままとする。
    if(!isUserInfoLoading && !userInfo){
        alert(MESSAGES.NOT_ALREADY_LOGGED_IN);
        navigate(ROUTES.POST_INDEX);
        return null;
    }

    return (
        <form onSubmit={onSubmit} className='common_container common_shadow post_form_container'>
            <h2>{formTitle}</h2>
            <label className='post_form_label'>タイトル</label>
            <input
                type="text"
                value={post.title}
                name="title"
                onChange={handleChange}
                className='post_form_input'
            />
            <label className='post_form_label'>内容</label>
            <textarea
                value={post.content}
                name="content"
                onChange={handleChange}
                className='post_form_textarea'
            />

            {/* <label className='post_form_label'>年齢</label>
            <select
                name="ageId"
                value={post.ageId || ''}
                onChange={handleChange}
                className='post_form_input'
            >
                <option value="" disabled>選択してください</option>
                {ages.map((age) => (
                    <option key={age.id} value={age.id}>
                        {age.value}
                    </option>
                ))}
            </select> */}

            {/* ラジオボタンを使用する場合の例 */}
            <label className='post_form_label'>年齢</label>
            <div className='post_form_radio_group'>
                {ages.map((age) => (
                    <label key={age.id} className='post_form_radio_label'>
                        <input
                            type="radio"
                            name="ageId"
                            value={age.id}
                            checked={Number(post.ageId) === age.id}
                            onChange={handleChange}
                            className='post_form_radio_input'
                        />
                        {age.value}
                    </label>
                ))}
            </div>
            !post?.imageUrl ? (
            <>
                犬読み込み中…
            </>
            ) : (
            <img src={post.imageUrl} alt="画像" className='post_form_image' />
            )
            <input type="button" value="ほかの子にする" onClick={handleButtonClick} className='common_button post_form_button post_form_other_dog_button' />

            <input type="submit" className='common_button post_form_button post_form_submit_button' value={buttonLabel} />
        </form >
    );
}

export default PostFormFields;