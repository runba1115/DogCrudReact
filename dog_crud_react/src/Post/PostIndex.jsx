import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { APIS, COMMON_STYLE, MESSAGES, ROUTES } from '../config/Constant';
import { useCreateErrorFromResponse } from '../hooks/CreateErrorFromResponse';
import { useShowErrorMessage } from '../hooks/ShowErrorMessage';
import { useUser } from '../contexts/UserContext';
import { Button, Card, CardActions, CardContent, CardMedia, Container, Typography } from '@mui/material';
import { useDeletePost } from '../hooks/DeletePost';

/**
 * 投稿一覧画面
 * @returns 投稿一覧画面
 */
function PostIndex() {
    const { userInfo, isAuthenticated } = useUser();
    const [posts, setPosts] = useState([]);
    const createErrorFromResponse = useCreateErrorFromResponse();
    const showErrorMessage = useShowErrorMessage();

    /**
     * 投稿一覧をAPI経由で取得してStateに格納する関数
     * fetchの成功可否をチェックし、失敗時にはエラーを通知する
     */
    const getPosts = useCallback(async () => {
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
    }, [createErrorFromResponse, showErrorMessage]);

    const deletePost = useDeletePost(getPosts);


    // 初回レンダリング時に投稿一覧を取得する
    useEffect(() => {
        getPosts();
    }, [getPosts]);

    return (
        <Container sx={{ maxWidth: COMMON_STYLE.FORM_MAX_WIDTH }}>
            <Button
                variant="contained"
                sx={{
                    mb: "10px"
                }}
                disabled={!isAuthenticated}
                {...(isAuthenticated &&
                {
                    component: Link,
                    to: ROUTES.POST_NEW,
                })
                }
            >
                新規作成
            </Button>
            <Typography variant="h5" component="div" gutterBottom>
                投稿一覧
            </Typography>
            {/* 投稿が存在しない場合のメッセージ表示 */}
            {posts.length === 0 ? (
                <Typography variant="h6" component="div" gutterBottom>
                    投稿はまだありません
                </Typography>
            ) : (
                <>
                    {posts.map(post => {
                        const isOwner = (post.userId === userInfo?.id);
                        return (
                            <Card sx={{ mb: '20px' }} key={post.id}>
                                <CardContent>
                                    <Typography variant="h6" component="div">{post.title}</Typography>
                                    <Typography variant="body1" sx={{whiteSpace: 'pre-line'}}>{post.content}</Typography>
                                    <Typography variant="body2">{post.ageValue}</Typography>
                                    <CardMedia
                                        component="img"
                                        src={post.imageUrl}
                                        alt="犬の画像"
                                        sx={{
                                            width: '250px'
                                        }}
                                    />
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        component={Link}
                                        to={ROUTES.POST_SHOW(post.id)}
                                    >
                                        詳細
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        component={Link}
                                        to={ROUTES.POST_EDIT(post.id)}
                                        disabled={!isOwner}
                                    >
                                        編集
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => { deletePost(post.id); }}
                                        disabled={!isOwner}
                                    >
                                        削除
                                    </Button>
                                </CardActions>
                            </Card>
                        );
                    })}
                </>
            )}
        </Container>
    );
}

export default PostIndex;