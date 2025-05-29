import { useEffect, useState } from "react";
import { APIS, HTTP_STATUS_CODES, MESSAGES, ROUTES } from "../config/Constant";
import { useNavigate } from 'react-router-dom';
import PostFormFields from "../components/PostFormFields";
import { useCreateErrorFromResponse } from "../hooks/CreateErrorFromResponse";
import { useShowErrorMessage } from "../hooks/ShowErrorMessage";
import { useShowValidatedMessage } from "../hooks/ShowValidatedMessage";
import { useIsPostValid } from "../hooks/IsPostValid";
import { useUser } from "../contexts/UserContext";

/**
 * 新規投稿作成ページ
 * @returns 新規投稿作成ページ
 */
function PostNew() {
    const { isAuthenticated } = useUser();
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
    const isPostValid = useIsPostValid();

    useEffect(() => {
        // ログインしていない場合新規投稿を作成できない。その旨を表示して投稿一覧画面に移動する
        if(!isAuthenticated){
            alert(MESSAGES.NO_PERMISSION);
            navigate(ROUTES.POST_INDEX);
            return;
        }
    }, []);

    /**
     * フォーム送信
     * @param {Object} e イベントオブジェクト
     */
    const handleSubmit = async (e) => {
        // 投稿を送信中の場合、以降の処理を行わない。
        if (isSubmitting) {
            return;
        }

        e.preventDefault();

        // 重複して行われないよう、投稿送信中フラグをtrueに設定
        setIsSubmitting(true);

        // 送信する前に、入力された値が適切かを確認する
        if (!isPostValid(post)) {
            // 不正な場合以降の処理を行わない。
            // ※メッセージ表示処理は上記内で行っているため不要
            setIsSubmitting(false);
            return;
        }

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

                    // ログイン情報がクッキーに保存されている。それを含めて送ることで実行したユーザーを判別できるようにする
                    credentials: 'include',
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

    return (
        <PostFormFields
            formTitle={'新規投稿'}
            post={post}
            setPost={setPost}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            buttonLabel={"投稿する"}
            isShow={false}
        />
    );
}

export default PostNew;