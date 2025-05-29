import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COMMON_STYLE, MESSAGES, ROUTES } from '../config/Constant';
import { useUser } from '../contexts/UserContext';
import { Button, Card, CardActions, CardContent, Container, TextField, Typography } from '@mui/material';
import { useIsUserValid } from '../hooks/IsUserValid';
import BackButton from '../components/BackButton';

/**
 * ログイン画面
 * @returns ログイン画面
 */
function UserLogin() {
    const { isAuthenticated, handleLogin } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [user, setUser] = useState({
        email: '',
        password: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };
    const navigate = useNavigate();
    const { isUserValidOnLogin } = useIsUserValid();

    /**
     * すでに認証済みかを確認する
     */
    useEffect(() => {
        // すでに認証済みの場合、投稿一覧画面へ遷移させる（ログインの必要がないため）
        if (!isInitialized) {
            setIsInitialized(true);

            if (isAuthenticated) {
                alert(MESSAGES.ALREADY_LOGGED_IN);
                navigate(ROUTES.POST_INDEX)
            }
        }
    }, [isAuthenticated, isInitialized, navigate]);

    /**
     * フォーム送信時に実行されるログイン処理
     * @param {Event} e - フォーム送信イベント
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) {
            //すでに送信中である。何も行わない。
            return;
        }

        //重複して送信されないよう、送信中フラグをtrueにする
        setIsSubmitting(true);

        // 送信する前に、入力された値が適切かを確認する
        if (!isUserValidOnLogin(user)) {
            // 不正な場合以降の処理を行わない。
            // ※メッセージ表示処理は上記内で行っているため不要
            setIsSubmitting(false);
            return;
        }

        // useUserにて取得した、ログイン処理を行う（例外は下記の関数内で処理しているためこちらでの処理は不要）
        const isSuccess = await handleLogin(user);

        if (isSuccess) {
            // ログイン処理により認証済みになった。その旨を表示し、投稿一覧画面へ遷移する。
            // ※メッセージ表示処理は上記の関数内にあるため不要。
            navigate(ROUTES.POST_INDEX);
        }

        // 送信が完了した。送信中フラグをfalseにする
        setIsSubmitting(false);
    };

    return (
        <Container sx={{ maxWidth: COMMON_STYLE.BODY_CONTAINER_MAX_WIDTH, m: 'auto', mb: '30px' }}>
            <BackButton />
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            m: 'auto',
                        }}>
                        <Typography variant='h6' component='div'>
                            ログイン
                        </Typography>

                        <TextField
                            label="メールアドレス"
                            type="email"
                            variant="outlined"
                            name="email"
                            required
                            fullWidth
                            onChange={handleChange}
                        />

                        <TextField
                            label="パスワード"
                            type="password"
                            variant="outlined"
                            name="password"
                            required
                            fullWidth
                            onChange={handleChange}
                        />
                    </CardContent>
                    <CardActions sx={{ m: 'auto', display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            type="submit"
                        >
                            ログイン
                        </Button>
                    </CardActions>
                </form>
            </Card >
        </Container>
    );
}

export default UserLogin;
