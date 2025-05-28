import { useEffect, useState } from 'react';
import { MESSAGES, ROUTES } from '../config/Constant';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

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
        const { field, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [field]: value }));
    }

    useEffect(() => {
        // すでに認証済みの場合、投稿一覧画面へ遷移させる（ログインの必要がないため）
        if (isAuthenticated) {
            alert(MESSAGES.ALREADY_LOGGED_IN);
            navigate(ROUTES.POST_INDEX)
        }
    }, []);

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
        <Container>
            <Typography>
                登録
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: '500px',
                    m: 'auto',
                }}
            >
                <TextField
                    label="ユーザー名"
                    variant="outlined"
                    required
                    fullWidth
                />

                <TextField
                    label="メールアドレス"
                    type="email"
                    variant="outlined"
                    required
                    fullWidth
                />

                <TextField
                    label="パスワード"
                    type="password"
                    variant="outlined"
                    required
                    fullWidth
                />

                <Button
                    variant="contained"
                >
                    登録する
                </Button>

            </Box>
        </Container>
        // <div className='common_container'>
        //     <div className='user_auth_container'>
        //         <h2 className='user_auth_title'>ユーザー登録</h2>
        //         <form onSubmit={handleSubmit} className='user_auth_form'>
        //             <div className='user_auth_form_group'>
        //                 <label className='user_auth_label'>ユーザー名</label>
        //                 <input
        //                     type="text"
        //                     value={userName}
        //                     onChange={(e) => setUserName(e.target.value)}
        //                     required
        //                     className='user_auth_input'
        //                 />
        //             </div>
        //             <div className='user_auth_form_group'>
        //                 <label className='user_auth_label'>メールアドレス</label>
        //                 <input
        //                     type="email"
        //                     value={email}
        //                     onChange={(e) => setEmail(e.target.value)}
        //                     required
        //                     className='user_auth_input'
        //                 />
        //             </div>
        //             <div className='user_auth_form_group'>
        //                 <label className='user_auth_label'>パスワード</label>
        //                 <input
        //                     type="password"
        //                     value={password}
        //                     onChange={(e) => setPassword(e.target.value)}
        //                     required
        //                     className='user_auth_input'
        //                 />
        //             </div>
        //             <div className='user_auth_button_group'>
        //                 <input type="submit" className='common_button user_auth_login_button' value={isSubmitting ? '実行中…' : '登録する'} disabled={isSubmitting} />
        //             </div>
        //         </form>
        //     </div>
        // </div>
    );
}

export default UserRegister;
