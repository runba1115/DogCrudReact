import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APIS, MESSAGES, ROUTES } from '../config/Constant';
import { useCreateErrorFromResponse } from '../hooks/CreateErrorFromResponse';
import { useShowErrorMessage } from '../hooks/ShowErrorMessage';
import { format } from 'date-fns';
import './PostIndex.css';

/**
 * 投稿一覧画面
 * @returns 投稿一覧画面
 */
function PostIndex() {
    const { userInfo, isUserInfoLoading , isAuthenticated } = useUser();
    const [posts, setPosts] = useState([]);
    const { handleShow, handleEdit, handleDelete } = usePostActions(userInfo);
    const navigate = useNavigate();
    const createErrorFromResponse = useCreateErrorFromResponse();
    const showErrorMessage = useShowErrorMessage();

    /**
     * 投稿一覧をAPI経由で取得してStateに格納する関数
     * fetchの成功可否をチェックし、失敗時にはエラーを通知する
     */
    const getPosts = async () => {
        try {
            // セッションに紐づいたユーザー情報を取得するAPIを呼び出す
            const res = await fetch(`${APIS.POST_ALL}`);

            if (res.ok) {
                // 投稿一覧データ（JSON）を取得して状態にセット
                const resultPosts = await res.json();
                setPosts(resultPosts);
            } else {
                // 想定外のステータスコード（4xx/5xxなど）
                throw await createErrorFromResponse(res);
            }
        } catch (error) {
            // ネットワークエラーまたはthrowされたErrorをキャッチ
            showErrorMessage(error, MESSAGES.POST_GET_FAILED);

            // 投稿を空にする
            setPosts([]);
        }
    }


    // 初回レンダリング時に投稿一覧を取得する
    useEffect(() => {
        getPosts();
    }, []);

    const handleNew = () => {
        // 認証済みでない場合、その旨を表示し、新規作成画面に遷移しない
        if(!isAuthenticated){
            alert(MESSAGES.NO_PERMISSION);
            return;
        }

        // 認証済みである。新規作成画面に遷移する
        navigate(ROUTES.POST_NEW);
    }

    // ユーザー情報の読み込み途中の場合何も表示しない。
    if(isUserInfoLoading){
        return null;
    }

    return (
        <div className='common_container '>
            {/* 新規投稿作成画面へのリンク */}
            <button onClick={() => handleNew()} className={`common_button post_create_button ${isAuthenticated ? "" : "post_simple_view_disable_button"}`} disabled={!isAuthenticated}>新規作成</button>
            <Link to={`/posts/new`} className='common_button post_create_button'>新規作成</Link>
            <h2>投稿一覧</h2>

            {/* 投稿が存在しない場合のメッセージ表示 */}
            {posts.length === 0 ? (
                <p>投稿がまだありません</p>
            ) : (
                <>
                    {posts.map(post => {
                        const isOwner = (post.userId === userInfo?.id);

                        return (
                            <div key={post.id} className='post_simple_view_post common_shadow'>
                                <h2>投稿詳細</h2>
                                <h3>{post.title}
                                    <span className="post_simple_date_info">年齢: {post.age.value}</span>
                                    <span className="post_simple_date_info">作成日時: {format(new Date(post.createdAt), 'yyyy/MM/dd HH:mm')}</span>
                                    <span className="post_simple_date_info">更新日時: {format(new Date(post.updatedAt), 'yyyy/MM/dd HH:mm')}</span>
                                </h3>
                                <p>{post.content}</p>
                                <img src={post.imageUrl} alt="犬の画像" className="post_simple_dog_image" />
                                <p>
                                    <button onClick={() => handleShow(post)} className={`common_button post_simple_view_button post_simple_view_simple_button`}>詳細</button>
                                    <button onClick={() => handleEdit(post)} className={`common_button post_simple_view_button post_simple_view_edit_button ${isOwner ? "" : "post_simple_view_disable_button"}`} disabled={!isOwner}>編集</button>
                                    <button onClick={() => handleDelete(post)} className={`common_button post_simple_view_button post_simple_view_delete_button ${isOwner ? "" : "post_simple_view_disable_button"}`}  disabled={!isOwner}>削除</button>
                                </p>
                            </div >
                        );
                    })}
                </>
            )}
        </div>
    );
}

export default PostIndex;