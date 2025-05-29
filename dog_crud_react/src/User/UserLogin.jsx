import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMMON_STYLE, MESSAGES, ROUTES } from '../config/Constant';
import { useUser } from '../contexts/UserContext';
import { Button, Card, CardActions, CardContent, TextField, Typography } from '@mui/material';

/**
 * ログイン画面
 * @returns ログイン画面
 */
function UserLogin() {
    const { isAuthenticated, handleLogin } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState({
        email: '',
        password: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };
    const navigate = useNavigate();

    useEffect(() => {
        // すでに認証済みの場合、投稿一覧画面へ遷移させる（ログインの必要がないため）
        if (isAuthenticated && !isSubmitting) {
            alert(MESSAGES.ALREADY_LOGGED_IN);
            navigate(ROUTES.POST_INDEX)
        }
    }, [isAuthenticated, isSubmitting, navigate]);

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

        // フォームのデフォルトの送信動作（ページリロード）をキャンセル
        e.preventDefault();

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

        <Card sx={{ maxWidth: COMMON_STYLE.FORM_MAX_WIDTH, m: 'auto' }}>
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
    );
}

export default UserLogin;
