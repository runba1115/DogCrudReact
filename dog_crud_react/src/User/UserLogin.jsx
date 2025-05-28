import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MESSAGES, ROUTES } from '../config/Constant';
import { useUser } from '../contexts/UserContext';

/**
 * ログイン画面
 * @returns ログイン画面
 */
function UserLogin() {
    const { isAuthenticated, handleLogin } = useUser();
    const [ isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        // すでに認証済みの場合、投稿一覧画面へ遷移させる（ログインの必要がないため）
        if(isAuthenticated){
            alert(MESSAGES.ALREADY_LOGGED_IN);
            navigate(ROUTES.POST_INDEX)
        }
    },[]);

    /**
     * フォーム送信時に実行されるログイン処理
     * @param {Event} e - フォーム送信イベント
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(isSubmitting){
            //すでに送信中である。何も行わない。
            return;
        }

        //重複して送信されないよう、送信中フラグをtrueにする
        setIsSubmitting(true);

        // フォームのデフォルトの送信動作（ページリロード）をキャンセル
        e.preventDefault();

        // useUserにて取得した、ログイン処理を行う（例外は下記の関数内で処理しているためこちらでの処理は不要）
        const isSuccess = await handleLogin(email, password);

        if(isSuccess){
            // ログイン処理により認証済みになった。その旨を表示し、投稿一覧画面へ遷移する。
            // ※メッセージ表示処理は上記の関数内にあるため不要。
            navigate(ROUTES.POST_INDEX);
        }

        // 送信が完了した。送信中フラグをfalseにする
        setIsSubmitting(false);
    };

    return (
        <div className="common_container">
            <div className='user_auth_container'>
                <h2 className='user_auth_title'>ログイン</h2>
                <form onSubmit={handleSubmit} className='user_auth_form'>
                    <div className='user_auth_form_group'>
                        <label className='user_auth_label'>メールアドレス</label>
                        <input
                            type="email"
                            value={email}
                            autoComplete="name"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="メールアドレス"
                            required
                            className='user_auth_input'
                        />
                    </div>
                    <div className='user_auth_form_group'>
                        <label className='user_auth_label'>パスワード</label>
                        <input
                            type="password"
                            value={password}
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="パスワード"
                            required
                            className='user_auth_input'
                        />
                    </div>
                    <div className='user_auth_button_group'>
                        <input type="submit" className='common_button user_auth_login_button' value={isSubmitting ? '実行中…' : 'ログイン'} disabled={isSubmitting} />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserLogin;
