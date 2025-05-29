import { useEffect, useState } from 'react';
import { APIS, HTTP_STATUS_CODES, MESSAGES, ROUTES } from '../config/Constant';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateErrorFromResponse } from '../hooks/CreateErrorFromResponse';
import { useShowErrorMessage } from '../hooks/ShowErrorMessage';
import PostFormFields from '../components/PostFormFields';
import { useShowValidatedMessage } from '../hooks/ShowValidatedMessage';
import { useUser } from '../contexts/UserContext';
import Loading from '../components/Loading';
import { useIsPostValid } from '../hooks/IsPostValid';

/**
 * 投稿編集画面
 * @returns 投稿編集画面
 */
function PostEdit() {
    // URL パラメータから投稿 ID を取得
    const { id } = useParams();
    const { userInfo } = useUser();

    // 送信中かどうかの状態を管理。初期値は false（送信中でない）
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [post, setPost] = useState({
        title: '',
        content: '',
        imageUrl: '',
        ageId: '',
    });
    const createErrorFromResponse = useCreateErrorFromResponse();
    const showErrorMessage = useShowErrorMessage();
    const navigate = useNavigate();
    const showValidatedMessage = useShowValidatedMessage();
    const [isInitialized, setIsInitialized] = useState(false);
    const isPostValid = useIsPostValid();

    /**
     * フォームが送信されたときのハンドラ
     * @param {Event} e - イベントオブジェクト
     */
    const handleSubmit = async (e) => {
        if (isSubmitting) {
            // 送信中である。中断する。
            return;
        }
        e.preventDefault();

        setIsSubmitting(true);

        // 送信する前に、入力された値が適切かを確認する
        if(!isPostValid(post)){
            // 不正な場合以降の処理を行わない。
            // ※メッセージ表示処理は上記内で行っているため不要
            setIsSubmitting(false);
            return;
        }

        // 更新確認ダイアログの表示を行う（キャンセルされたら中断）
        if (!window.confirm(MESSAGES.POST_EXECUTE_CONFIRM)) {
            alert("キャンセルされました");
            return;
        }

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
                    body: JSON.stringify(post),

                    // ログイン情報がクッキーに保存されている。それを含めて送ることで実行したユーザーを判別できるようにする
                    credentials: 'include',
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
                } else if (response.status === HTTP_STATUS_CODES.FORBIDDEN) {
                    // 更新が拒否された(投稿の作成者ではない)
                    // →更新できないユーザーが編集ページを開いている。一覧画面に遷移する。
                    alert(MESSAGES.NO_PERMISSION);
                    navigate(ROUTES.POST_INDEX);
                } else if (response.status === HTTP_STATUS_CODES.BAD_REQUEST) {
                    // バリデーションエラーが発生した
                    await showValidatedMessage(response);
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
        // 初回のみ実行するため、初期化済みフラグがtrueなら以降の処理を行わない
        // ※useEffectは第二引数の[]内を空にすることで1回のみ行われるようにできるが、第1引数の処理に影響を与えるものを第2引数に格納するのがuseEffectの記載として望ましい。
        //   その形を維持しつつ、最初の1回のみ実行される洋子の形としている。
        if (isInitialized) {
            return;
        }

        setIsInitialized(true);

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

                    // 取得したデータの通りに値を設定する。
                    setPost({ ...data });

                    // 取得したデータの作成者とログインしているユーザーが異なる場合、その旨を表示して一覧画面に戻る
                    if (data.userId !== userInfo.id) {
                        alert(MESSAGES.NO_PERMISSION);
                        navigate(ROUTES.POST_INDEX);
                    }
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


        // 投稿を作成したユーザーのIDとログインしているユーザーのIDが異なる場合、権限がない旨を表示して一覧画面に戻る
        if (!userInfo) {
            alert(MESSAGES.NO_PERMISSION);
            navigate(ROUTES.POST_INDEX);

            // 以降の処理を行わない。
            return;
        }
    }, [isInitialized, createErrorFromResponse, showErrorMessage, id, navigate, userInfo]);

    // 投稿が読み込み中の場合、読み込み中画面を表示する
    // ※画像のURLが空の場合、自動的に別の画像のURLが取得されてしまう。postだけの確認では、imageUrlに値が設定され終わる前に条件が成立してしまうため、
    // imageUrlが空である限り読み込み中画面を表示する
    if (!post.imageUrl) {
        return <Loading />
    }

    return (
        <PostFormFields
            formTitle={'投稿編集'}
            post={post}
            setPost={setPost}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            buttonLabel={"更新する"}
        />
    );
}

export default PostEdit;