import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { APIS, HTTP_STATUS_CODES, MESSAGES, ROUTES } from '../config/Constant';
import { useDeletePost } from '../hooks/DeletePost';
import { useCreateErrorFromResponse } from '../hooks/CreateErrorFromResponse';
import { useShowErrorMessage } from '../hooks/ShowErrorMessage';
import { format } from 'date-fns';
import { useUser } from '../contexts/UserContext';
import { usePostActions } from '../hooks/PostActions';
import Loading from '../components/Loading';
import { Button, Card, CardActions, CardContent, CardMedia, Stack, Typography } from '@mui/material';

/**
 * 投稿詳細画面
 * @returns 投稿詳細画面
 */
function PostShow() {
    const { userInfo } = useUser();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();
    const { handleEdit, handleDelete } = usePostActions(userInfo);
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

    // 投稿が読み込み中の場合、読み込み中画面を表示する
    if (!post) {
        return <Loading />
    }

    const isOwner = (post.userId === userInfo?.id);

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2}>
                    <Typography variant="h6" component="div">{post.title}</Typography>
                    <Typography variant="body1">{post.content}</Typography>
                </Stack>
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
                    disabled={!isOwner}
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
                    onClick={handleDelete}
                    disabled={!isOwner}
                >
                    削除
                </Button>
            </CardActions>

        </Card>
    );
}

export default PostShow;