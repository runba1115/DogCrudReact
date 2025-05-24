import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL, APIS, HTTP_STATUS_CODES, MESSAGES, ROUTES } from '../config/Constant';
import { useDeletePost } from '../hooks/DeletePost';
import { useCreateErrorFromResponse } from '../hooks/CreateErrorFromResponse';
import { useShowErrorMessage } from '../hooks/ShowErrorMessage';
// import './PostShow.css';

/**
 * 投稿詳細画面
 * @returns 投稿詳細画面
 */
function PostShow() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();
    const deletePost = useDeletePost(useCallback(() => { navigate(ROUTES.POST_INDEX); }, [navigate]));
    const createErrorFromResponse = useCreateErrorFromResponse();
    const showErrorMessage = useShowErrorMessage();

    /**
     * APIから投稿詳細を取得する非同期関数
     * 成功時には取得したデータをstateにセットし、失敗時にはエラー通知とリダイレクトを行う
     */
    const getPost = async () => {
        try {
            // 投稿詳細の取得APIを呼び出す
            const res = await fetch(`${APIS.POST_GET_BY_ID(id)}`);

            if (res.ok) {
                // 正常なレスポンスの場合、JSONデータを取得してstateにセット
                const resultPost = await res.json();
                setPost(resultPost);
            } else {
                if (res.status === HTTP_STATUS_CODES.NOT_FOUND) {
                    // 投稿が見つからなかった
                    // その旨を表示し一覧画面に遷移する
                    alert(MESSAGES.POST_NOT_FOUND);
                    navigate(ROUTES.POST_INDEX);
                    return;
                }

                // 想定外のステータスコードの場合、エラーを発生させる
                throw await createErrorFromResponse(res);
            }
        } catch (error) {
            // ネットワークエラーまたはthrowされたErrorをキャッチ
            showErrorMessage(error, MESSAGES.POST_GET_FAILED)
            navigate(ROUTES.POST_INDEX);
            return;
        }
    }

    /**
     * 初回レンダリング時に投稿詳細を取得する
     * useEffectを使用してコンポーネントマウント時に実行
     */
    useEffect(() => {
        getPost();
    }, []);

    /**
     * 削除ボタン押下時に呼ばれる関数
     * 指定IDの投稿を削除した後、投稿一覧に遷移する
     *
     * @param {number|string} id - 削除対象の投稿ID
     */
    const handleDelete = async (id) => {
        await deletePost(id);
    }

    return (
        <div className='common_container'>
            {post == null ? (
                <div>読み込み中です…</div>
            ) : (

                <div className='posts_detail_view_post'>
                    <h2>投稿詳細</h2>
                    {/* <p className="posts_simple_view_user">ユーザー名：{post.user.userName}</p> */}
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    {/* <p>投稿者ID: {post.user.id}</p> */}
                    <p>作成日時: {post.createdAt}</p>
                    <p>更新日時: {post.updatedAt}</p>
                    <img src={post.imageUrl} alt="犬の画像" />
                    <Link to={ROUTES.POST_EDIT(post.id)} className={"common_button posts_simple_view_button posts_simple_view_edit_button"}>編集</Link>
                    <button onClick={() => handleDelete(post.id)} className={"common_button posts_simple_view_button posts_simple_view_delete_button"}>削除</button>
                </div >
            )}
        </div>

    );
}

export default PostShow;