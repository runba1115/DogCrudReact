import { Link } from "react-router-dom";
import { ROUTES } from "../config/Constant";
import './Header.css'

/**
 * アプリケーション全体で表示されるヘッダー
 * @returns ヘッダー
 */
function Header({isAuthenticated, email/*, handleLogin, handleLogout*/}) {
    return (
        <header>
            <div className="common_container header_container">
                <div className="heder_left_element">
                    <p>
                        犬Crud
                    </p>
                </div>
                <div className="header_right_element">
                    {
                        isAuthenticated
                            ? (
                                // ログイン済みの場合：ユーザー情報とログアウトボタンを表示する
                                <>
                                    <p>{email}</p>
                                    {/* <button onClick={handleLogout} className="common_button_to_link">ログアウト</button> */}
                                </>
                            )
                            : (
                                <>
                                    {/* <button onClick={handleLogin} className="common_button_to_link">ログイン</button> */}
                                </>
                            )
                    }
                </div>
            </div>
        </header>
    );
}

// ログイン済みの場合、ユーザー情報とログアウトボタンを表示する
export default Header;