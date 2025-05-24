import { useEffect, useState } from 'react';
import { API_BASE_URL, APIS, HTTP_STATUS_CODES, MESSAGES, ROUTES } from '../config/Constant';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateErrorFromResponse } from '../hooks/CreateErrorFromResponse';
import { useShowErrorMessage } from '../hooks/ShowErrorMessage';
import PostFormFields from '../components/PostFormFields';
import { useShowVaridatedMessage } from '../hooks/ShowValidatedMessage';

/**
 * 投稿編集画面
 * @returns 投稿編集画面
 */
function PostEdit() {
    // URL パラメータから投稿 ID を取得
    const { id } = useParams();

    // 送信中かどうかの状態を管理。初期値は false（送信中でない）
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [post, setPost] = useState({
        title: '',
        content: '',
        imageUrl: '',
        password: '',
    });
    const createErrorFromResponse = useCreateErrorFromResponse();
    const showErrorMessage = useShowErrorMessage();
    const navigate = useNavigate();
    const showVaridatedMessage = useShowVaridatedMessage();

    /**
     * フォームが送信されたときのハンドラ
     * @param {Event} e - イベントオブジェクト
     */
    const handleSubmit = async (e) => {
        if (isSubmitting) {
            // 送信中である。中断する。
            return;
        }

        // 更新確認ダイアログの表示を行う（キャンセルされたら中断）
        if(!window.confirm(MESSAGES.POST_EXECUTE_CONFIRM)){
            alert("キャンセルされました");
            return;
        }

        setIsSubmitting(true);

        // フォームのデフォルトの送信動作をキャンセルする
        e.preventDefault();

        try {
            // API を呼び出して投稿を更新する
            const response = await fetch(
                `${APIS.POST_EDIT(id)}`,
                {
                    method: 'PUT',
                    headers:
                    {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(post)
                }
            );

            if (response.ok) {
                // 更新に成功した。投稿一覧に遷移する。
                alert(MESSAGES.POST_UPDATE_SUCCESSED);
                navigate(ROUTES.POST_INDEX);
            }
            else {
                if (response.status === HTTP_STATUS_CODES.NOT_FOUND) {
                    // 更新対象の投稿が見つからなかった（削除された可能性がある）。投稿一覧に遷移する。
                    alert(MESSAGES.POST_NOT_FOUND);
                    navigate(ROUTES.POST_INDEX);
                } else if (response.status == HTTP_STATUS_CODES.FORBIDDEN) {
                    // 更新が拒否された（不正なパスワードである）
                    alert(MESSAGES.POST_UPDATE_FORBIDDEN)
                }else if(response.status === HTTP_STATUS_CODES.BAD_REQUEST){
                    // バリデーションエラーが発生した
                    await showVaridatedMessage(response);
                }
                else {
                    // 想定外のエラーが発生した。
                    throw await createErrorFromResponse();
                }
            }
        } catch (error) {
            showErrorMessage(error, MESSAGES.POST_UPDATE_FAILED);
        }
        finally {
            // 送信完了したため送信中フラグを解除する
            setIsSubmitting(false);
        }
    }

    // 初めて表示された時の初期化処理
    useEffect(() => {
        /**
         * 編集対象の投稿を取得する非同期関数
         */
        const fetchPost = async () => {
            try {
                // API を呼び出して投稿データを取得する
                const response = await fetch(`${APIS.POST_GET_BY_ID(id)}`);
                if (response.ok) {
                    // 投稿の取得に成功した場合
                    const data = await response.json();

                    // 取得したデータの通り、パスワード以外を設定する。
                    // ※パスワードはユーザーに
                    setPost({...data, password: ''});
                } else {
                    // 投稿の取得に失敗した場合
                    if (response.status === HTTP_STATUS_CODES.NOT_FOUND) {
                        // 更新対象の投稿が見つからなかった（削除された可能性がある）。投稿一覧に遷移し、以降の処理を行わない
                        alert(MESSAGES.POST_NOT_FOUND);
                        navigate(ROUTES.POST_INDEX);
                        return;
                    } else {
                        // 想定外のエラーが発生した
                        throw await createErrorFromResponse();
                    }
                }
            } catch (error) {
                showErrorMessage(error, MESSAGES.POST_GET_FAILED);
            }
        };

        fetchPost();
    }, [createErrorFromResponse, showErrorMessage, id, navigate]);


    return (
        // このページを表示した時点ではまだ投稿を取得できていない。
        // その状態で下記を表示すると、画像のURLが設定されていないとして、別の画像のURLが設定されてしまう。
        // 取得できていない間はその旨を表示するのはそういった理由からである。
        !post?.imageUrl ? (
            <p>読み込み中です…しばらくお待ちください</p>
        ) : (
            <PostFormFields
                formTitle={'投稿編集'}
                post={post}
                isEdit={true}
                setPost={setPost}
                onSubmit={handleSubmit}
                buttonLabel={"更新する"}
            />
        )
    );
}

export default PostEdit;