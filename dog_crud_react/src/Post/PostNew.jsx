import { useEffect, useState } from "react";
import { APIS, HTTP_STATUS_CODES, MESSAGES, ROUTES } from "../config/Constant";
import { useNavigate } from 'react-router-dom';
import PostFormFields from "../components/PostFormFields";
import { useCreateErrorFromResponse } from "../hooks/CreateErrorFromResponse";
import { useShowErrorMessage } from "../hooks/ShowErrorMessage";
import { useShowValidatedMessage } from "../hooks/ShowValidatedMessage";

/**
 * 新規投稿作成ページ
 * @returns 新規投稿作成ページ
 */
function PostNew() {
    // const { userInfo, isUserInfoLoading  } = useUser();
    const [post, setPost] = useState({
        title: '',
        content: '',
        imageUrl: '',
        ageId: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const createErrorFromResponse = useCreateErrorFromResponse();
    const showErrorMessage = useShowErrorMessage();
    const showValidatedMessage = useShowValidatedMessage();

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
                if (response.status === HTTP_STATUS_CODES.BAD_REQUEST) {
                    await showValidatedMessage(response);
                }
                else {
                    // 想定外の例外が発生した
                    throw await createErrorFromResponse(response);
                }
            }
        } catch (error) {
            // ネットワークエラーまたはサーバーエラーをキャッチ
            showErrorMessage(error, MESSAGES.POST_CREATE_FAILED)
        } finally {
            // 投稿送信中フラグをfalseにリセット
            setIsSubmitting(false);
        }
    }

    // // ユーザー情報の読み込み途中の場合何も表示しない。
    // if(isUserInfoLoading){
    //     return null;
    // }

    // // 情報が存在しない（ログインしていない）場合、その旨を表示して一覧表示画面へ遷移する
    // // 白い画面上にメッセージが表示される動きとなるが、URLが直接入力されない限りあり得ないためこの通りとする。
    // if(!isUserInfoLoading && !userInfo){
    //     alert(MESSAGES.NOT_ALREADY_LOGGED_IN);
    //     navigate(ROUTES.POST_INDEX);
    //     return null;
    // }

    return (
        <PostFormFields
            formTitle={'新規投稿'}
            post={post}
            setPost={setPost}
            onSubmit={handleSubmit}
            buttonLabel={"投稿する"}
        />
    );
}

export default PostNew;