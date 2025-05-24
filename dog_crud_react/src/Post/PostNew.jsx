import { useEffect, useState } from "react";
import { APIS, MESSAGES, ROUTES } from "../config/Constant";
import { useNavigate } from 'react-router-dom';
import PostFormFields from "../components/PostFormFields";
import { useCreateErrorFromResponse } from "../hooks/CreateErrorFromResponse";
import { useShowErrorMessage } from "../hooks/ShowErrorMessage";

/**
 * 新規投稿作成ページ
 * @returns 新規投稿作成ページ
 */
function PostNew({isAuthenticated, email, userPasword}) {
    const [post, setPost] = useState({
        title: '',
        content: '',
        imageUrl: '',
        password: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const createErrorFromResponse = useCreateErrorFromResponse();
    const showErrorMessage = useShowErrorMessage();

    /**
     * 初回レンダリング時の処理
     * - 未ログインの場合、投稿フォームへのアクセスをブロック
     * - ユーザーIDを投稿データに設定
     */
    useEffect(()=>{
        if(isAuthenticated && userPasword !== null && userPasword !== ''){
            setPost(prevPost => ({...prevPost, password: userPasword}));
        }
    },[]);

    /**
     * フォーム送信
     * @param {Object} e イベントオブジェクト
     */
    const handleSubmit = async (e) => {
        // 投稿を送信中の場合、以降の処理を行わない。
        if (isSubmitting) {
            return;
        }

        // 重複して行われないよう、投稿送信中フラグをtrueに設定
        setIsSubmitting(true);

        // デフォルトのフォーム送信動作（ページリロード）を無効化
        e.preventDefault();

        try {
            // APIに投稿のデータを送信する
            const response = await fetch(
                `${APIS.POST_CREATE}`,
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(post),
                }
            );

            if (response.ok) {
                // 投稿の作成に成功した。その旨を表示し、投稿一覧に遷移する。
                alert(MESSAGES.POST_CREATE_SUCCESSED);
                navigate(ROUTES.POST_INDEX);
            } else {
                // 想定外の例外が発生した
                throw await createErrorFromResponse(response);
            }
        } catch (error) {
            // ネットワークエラーまたはサーバーエラーをキャッチ
            showErrorMessage(error, MESSAGES.POST_CREATE_FAILED)
        } finally{
            // 投稿送信中フラグをfalseにリセット
            setIsSubmitting(false);
        }
    }

    return (
        <PostFormFields
            formTitle={'新規投稿'}
            post={post}
            setPost={setPost}
            isEdit={true}
            onSubmit={handleSubmit}
            buttonLabel={"投稿する"}
        />
    );
}

export default PostNew;