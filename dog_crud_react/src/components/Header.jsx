import { Link } from "react-router-dom";
import { ROUTES } from "../config/Constant";
import './Header.css'

/**
 * アプリケーション全体で表示されるヘッダー
 * @returns ヘッダー
 */
function Header() {
    const { userInfo, isAuthenticated, handleLogout, isUserInfoLoading  } = useUser();

    // 認証情報の取得中は読み込み中である旨を表示する
    // ※ほかの画面でも上記の関数を用いて、認証情報の取得中かを確認する処理を設けている。
    //   読み込み中である旨を表示すると、同じような内容が複数表示されたり、表示が崩れたりする。そのため表示しない。
    //   （ほかのファイルでは同様の記載は省略する。）
    if(isUserInfoLoading){
        return null;
    }

    return (
        <header>
            <div className="common_container header_container">
                <div className="header_left_element">
                    <Link to={ROUTES.POST_INDEX}>犬CRUD</Link>
                </div>
                <div className="header_right_element">
                    {
                        isAuthenticated
                            ? (
                                // ログイン済みの場合：ユーザー情報とログアウトボタンを表示する
                                <>
                                    <p>{userInfo.userName}</p>
                                    <button onClick={handleLogout} className="common_button_to_link">ログアウト</button>
                                </>
                            )
                            : (
                                // 未ログインの場合：新規登録／ログインリンクを表示する
                                <>
                                    <Link to={ROUTES.USER_REGISTER}>新規登録</Link>
                                    <Link to={ROUTES.USER_LOGIN}>ログインする</Link>
                                </>
                            )
                    }
                </div>
            </div>
        </header>
    );
}

export default Header;