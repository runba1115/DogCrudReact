// Context API を用いたユーザー情報の管理を行うためのimport
import { createContext, useState, useContext } from 'react';
import { APIS, HTTP_STATUS_CODES, MESSAGES } from '../config/Constant';
import { useCreateErrorFromResponse } from '../hooks/CreateErrorFromResponse';
import { useShowErrorMessage } from '../hooks/ShowErrorMessage';
import { useShowValidatedMessage } from '../hooks/ShowValidatedMessage';

// ユーザー情報と認証状態を格納するContext
export const UserContext = createContext();


/**
 * ユーザー情報をグローバルに保持・提供するためのProviderコンポーネント
 * @param {React.ReactNode} children - 子要素（このProviderに包まれるすべての要素）
 * @returns- Providerで囲われた子要素たち
 */
export const UserProvider = ({ children }) => {
    // ユーザー情報（ログイン後に設定）
    const [userInfo, setUserInfo] = useState(null);
    const [isUserInfoLoading, setIsUserInfoLoading] = useState(true);

    // 認証済みかどうかの状態
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const createErrorFromResponse = useCreateErrorFromResponse();
    const showErrorMessage = useShowErrorMessage();
    const showValidatedMessage = useShowValidatedMessage();

    /**
     * アプリ起動時などにセッションが有効かどうか確認し、
     * ログイン済みなら userInfo に情報をセットする
     * 未ログインやセッション切れなら状態を初期化する
     */
    const initializeUser = async () => {
        try {
            // セッションに紐づいたユーザー情報を取得するAPIを呼び出す
            const res = await fetch(`${APIS.USER_GET_CURRENT}`, {
                credentials: 'include',
            });

            if (res.ok) {
                // 認証OK（ログイン済み）
                // ユーザー情報の読み取り
                const data = await res.json();

                // ユーザーの情報を状態として保持する
                setUserInfo(data);

                // 認証済みに設定する
                setIsAuthenticated(true);
            } else {
                console.log(res);
                if (res.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
                    // セッションが切れているなどで未認証の場合
                    // 未ログイン状態に設定する
                    setUserInfo(null);
                    setIsAuthenticated(false);
                }
                else {
                    // それ以外の想定外エラー
                    throw createErrorFromResponse(res);
                }
            }
        } catch (error) {
            // fetch失敗または上記の throw によるキャッチ
            showErrorMessage(error, MESSAGES.USER_INFO_GET_FAILED)

            // 未ログイン状態に設定する
            setUserInfo(null);
            setIsAuthenticated(false);
        } finally {
            setIsUserInfoLoading(false);
        }
    };

    /**
     * 登録を行う
     * @param  userName 名前
     * @param  email メールアドレス
     * @param  password パスワード
     * @returns true:登録に成功した　false:登録に失敗した
     *          ※登録を行う関数のため、これが登録に成功、失敗したかというのを返すのは責務の観点から望ましくない。
     *            ただし、認証済みであることを表す変数に state 系の関数を用いて値を設定しても、関数を抜けた直後にそれが反映されているとは限らない。（非同期のため。）
     *            そのため、本関数が値を返すようにする。
     */
    const handleRegister = async (user) => {
        try {
            const response = await fetch(`${APIS.USER_REGISTER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });

            if (response.ok) {
                // 登録成功時
                alert(MESSAGES.USER_REGISTER_SUCCESSED);

                // 成功したことを表すtrueを返す
                return true;
            } else {
                if (response.status === HTTP_STATUS_CODES.BAD_REQUEST) {
                    showValidatedMessage(response);
                }
                else {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

            }
        } catch (error) {
            showErrorMessage(error, MESSAGES.USER_REGISTER_FAILED);
            // 失敗したことを表すfalseを返す
            return false;
        }
    };

    /**
     * ログインを行う
     * @param email
     * @param password
     * @return true:ログインに成功した　false:ログインに失敗した（ログインを行う関数が、その成否を返す理由は登録を行う関数と同じ。）
     */
    const handleLogin = async (email, password) => {
        // フォームデータを URL エンコード形式で作成する
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        try {
            // ログイン API を呼び出して認証を試みる
            const response = await fetch(`${APIS.USER_LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include', // 認証情報（クッキーなど）を含める
                body: formData// リクエストボディにフォームデータを設定
            });

            if (response.ok) {
                // ログインに成功した
                alert(MESSAGES.LOG_IN_SUCCESS);

                // ユーザー初期化処理を再度実行することでログインした状態にする
                await initializeUser();

                // ログインに成功したことを表すtrueを返す。
                return true;
            } else {
                throw await createErrorFromResponse(response);
            }
        } catch (error) {
            showErrorMessage(error, MESSAGES.LOG_IN_FAILED);

            // ログインに失敗したことを表すfalseを返す。
            return false;
        }
    };

    /**
     * ログアウト処理（セッション破棄・ステータス更新）
     */
    const handleLogout = async () => {
        try {
            const res = await fetch(`${APIS.USER_LOGOUT}`, {
                method: "POST",
                credentials: "include",
            });

            if (res.ok) {
                // 成功したら未ログイン状態に設定する
                alert(MESSAGES.LOG_OUT_SUCCESS);
                setIsAuthenticated(false);
                setUserInfo(null);
            } else {
                // 想定外エラーが発生した
                // catch文で対応できるよう、エラーを投げる
                throw await createErrorFromResponse(res);
            }
        } catch (error) {
            // 通信エラーや想定外の例外
            // エラーメッセージを表示する
            showErrorMessage(error, MESSAGES.LOG_OUT_FAILED)
        }
    };

    // Contextとして全機能・状態を子要素に渡す
    return (
        <UserContext.Provider value={{
            isUserInfoLoading,
            userInfo,
            isAuthenticated,
            setIsAuthenticated,
            initializeUser,
            handleRegister,
            handleLogin,
            handleLogout
        }}>
            {children}
        </UserContext.Provider>
    );
};


/**
 * useUser フック：任意のコンポーネントでユーザー情報や認証状態を簡単に扱えるようにする
 * @returns  - Context内で提供されている各種値や関数
 */
export const useUser = () => {
    const context = useContext(UserContext);
    if (context == null) {
        // Provider外で呼び出された場合は明示的にエラーを出す
        throw new Error(MESSAGES.NOT_USED_IN_USER_PROVIDER);
    }
    return context;
};