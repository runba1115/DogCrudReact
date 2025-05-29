import { useEffect, useState } from 'react';
import { COMMON_STYLE, MESSAGES, ROUTES } from '../config/Constant';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Button, Card, CardActions, CardContent, Container, TextField, Typography } from '@mui/material';
import { useIsUserValid } from '../hooks/IsUserValid';
import BackButton from '../components/BackButton';

/**
 * ユーザー登録画面
 * @returns ユーザー登録画面
 */
function UserRegister() {
    const { isAuthenticated, handleRegister } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isUserValidOnRegister } = useIsUserValid();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        userName: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    }

    useEffect(() => {
        // すでに認証済みの場合、投稿一覧画面へ遷移させる（ログインの必要がないため）
        if (isAuthenticated) {
            alert(MESSAGES.ALREADY_LOGGED_IN);
            navigate(ROUTES.POST_INDEX)
        }
    }, [isAuthenticated, navigate]);

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
        if (!isUserValidOnRegister(user)) {
            // 不正な場合以降の処理を行わない。
            // ※メッセージ表示処理は上記内で行っているため不要
            setIsSubmitting(false);
            return;
        }

        const isSuccess = await handleRegister(user);

        if (isSuccess) {
            // 成功時にログイン画面へ遷移する
            navigate(ROUTES.USER_LOGIN);
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
                        <Typography>
                            登録
                        </Typography>
                        <TextField
                            label="ユーザー名"
                            variant="outlined"
                            name="userName"
                            required
                            fullWidth
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />

                        <TextField
                            label="メールアドレス"
                            type="email"
                            variant="outlined"
                            name="email"
                            required
                            fullWidth
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />

                        <TextField
                            label="パスワード"
                            type="password"
                            variant="outlined"
                            name="password"
                            required
                            fullWidth
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </CardContent>
                    <CardActions sx={{ m: 'auto', display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            type="submit"
                            loading={isSubmitting}
                        >
                            登録する
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </Container>
    );
}

export default UserRegister;
