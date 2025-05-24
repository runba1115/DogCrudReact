// import './PostFormFields.css'

import { useCallback, useEffect } from "react";
import { useCreateErrorFromResponse } from "../hooks/CreateErrorFromResponse";
import { useShowErrorMessage } from "../hooks/ShowErrorMessage";

/**
 * 投稿作成（もしくは編集）画面の
 * @param {String} formTitle フォームのタイトル
 * @param {String} post 投稿の内容（title,content,imageUrl,passwordが格納されている値）
 * @param {boolean} isEdit 編集時の画面かどうか（true:編集時の画面 false:編集時ではない（新規作成時）の画面）
 * @param {Function} onSubmit フォームを送信するボタンクリック時の関数
 * @param {String} buttonLabel フォームを送信するボタンに表示する文字列
 * @returns 
 */
function PostFormFields({ formTitle, post, setPost, isEdit, onSubmit, buttonLabel }) {
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
        console.log(post);
        if (!post?.imageUrl) {
            handleButtonClick();
        }
    }, [handleButtonClick]);

    return (
        <form onSubmit={onSubmit} className='common_container common_shadow post_form_container'>
            <h2>{formTitle}</h2>
            <label className='post_form_label'></label>
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
            <label className='post_form_label'>パスワード{isEdit ? '※投稿を作成したときのものを入力してください' :''}</label>
            <input
                type="password"
                value={post.password}
                name="password"
                onChange={handleChange}
                className='post_form_input'
            />
            {
                !post?.imageUrl ? (
                    <>
                        犬読み込み中…
                    </>
                ) : (
                    <img src={post.imageUrl} alt="画像" />
                )
            }
            <input type="button" value="ほかの子にする" onClick={handleButtonClick} />

            <input type="submit" className='common_button post_form_submit_button' value={buttonLabel} />
        </form >
    );
}

export default PostFormFields;