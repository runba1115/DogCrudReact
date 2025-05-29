import { useEffect, useState } from 'react';
import { COMMON_STYLE, MESSAGES, ROUTES } from '../config/Constant';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Button, Card, CardActions, CardContent, TextField, Typography } from '@mui/material';

/**
 * ユーザー登録画面
 * @returns ユーザー登録画面
 */
function UserRegister() {
    const { isAuthenticated, handleRegister } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
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

        const isSuccess = await handleRegister(user);

        if (isSuccess) {
            // 成功時にログイン画面へ遷移する
            navigate(ROUTES.USER_LOGIN);
        }

        // 送信が完了した。送信中フラグをfalseにする
        setIsSubmitting(false);
    };

    return (

        <Card sx={{ maxWidth: COMMON_STYLE.FORM_MAX_WIDTH, m: 'auto' }}>
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
            <CardActions sx={{m: 'auto', display: 'flex', justifyContent: 'center'}}>
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
    );
}

export default UserRegister;
