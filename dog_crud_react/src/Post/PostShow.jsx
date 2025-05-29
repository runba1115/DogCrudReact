import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { APIS, COMMON_STYLE, HTTP_STATUS_CODES, MESSAGES, ROUTES } from '../config/Constant';
import { useCreateErrorFromResponse } from '../hooks/CreateErrorFromResponse';
import { useShowErrorMessage } from '../hooks/ShowErrorMessage';
import { useUser } from '../contexts/UserContext';
import Loading from '../components/Loading';
import { Button, Card, CardActions, CardContent, CardMedia, Container, Stack, Typography } from '@mui/material';
import { useDeletePost } from '../hooks/DeletePost';
import { format } from 'date-fns';
import BackButton from '../components/BackButton';
import PostFormFields from '../components/PostFormFields';

/**
 * 投稿詳細画面
 * @returns 投稿詳細画面
 */
function PostShow() {
    const { userInfo } = useUser();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();
    const createErrorFromResponse = useCreateErrorFromResponse();
    const showErrorMessage = useShowErrorMessage();
    const deletePost = useDeletePost(() => { navigate(ROUTES.POST_INDEX) });

    /**
     * APIから投稿詳細を取得する非同期関数
     * 成功時には取得したデータをstateにセットし、失敗時にはエラー通知とリダイレクトを行う
     */
    const getPost = useCallback(async () => {
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
    }, [createErrorFromResponse, id, navigate, showErrorMessage]);

    /**
     * 初回レンダリング時に投稿詳細を取得する
     * useEffectを使用してコンポーネントマウント時に実行
     */
    useEffect(() => {
        getPost();
    }, [getPost]);

    // 投稿が読み込み中の場合、読み込み中画面を表示する
    if (!post) {
        return <Loading />
    }

    const isOwner = (post.userId === userInfo?.id);

    return (
        // <Container sx={{ maxWidth: COMMON_STYLE.BODY_CONTAINER_MAX_WIDTH, m: 'auto', mb: '30px' }}>
        //     <BackButton />

        //     <Card sx={{ m: 'auto' }}>
        //         <CardContent>
        //             <Stack direction="row" spacing={2} alignItems="flex-end">
        //                 <Typography variant="h6" component="div">{post.title}</Typography>
        //                 <Typography variant="body1" component="div">{format(new Date(post.updatedAt), 'yyyy-MM-dd HH:mm:ss')}</Typography>
        //             </Stack>
        //             <Typography variant="body1">{post.content}</Typography>
        //             <CardMedia
        //                 component="img"
        //                 src={post.imageUrl}
        //                 alt="犬の画像"
        //                 sx={{
        //                     width: '250px'
        //                 }}
        //             />
        //         </CardContent>
        //         <CardActions>
        //             <Button
        //                 variant="contained"
        //                 color="success"
        //                 size="small"
        //                 component={Link}
        //                 to={ROUTES.POST_EDIT(post.id)}
        //                 disabled={!isOwner}
        //             >
        //                 編集
        //             </Button>
        //             <Button
        //                 variant="contained"
        //                 color="error"
        //                 size="small"
        //                 onClick={() => { deletePost(post.id); }}
        //                 disabled={!isOwner}
        //             >
        //                 削除
        //             </Button>
        //         </CardActions>

        //     </Card>
        // </Container>
        <PostFormFields
            formTitle={'投稿詳細'}
            post={post}
            isShow={true}
        />
    );
}

export default PostShow;