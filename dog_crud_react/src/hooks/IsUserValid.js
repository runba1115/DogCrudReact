//　定数のインポートを行う
import { useCallback } from "react";
import { MESSAGES, VALIDATE_VALUES } from "../config/Constant";

/**
 * バリデーションのエラーメッセージ表示用のカスタムフック
 * エラーのログ出力及びメッセージの表示を行う
 * @returns showErrorMessage 引数にcatch文で使用するerror、表示するメッセージを受け取りエラーメッセージを表示する関数
 */
export const useIsUserValid = () => {

    /**
     * ログイン時のユーザーの情報として適切な場合trueを返す
     * @param user 登録するユーザーの情報
     */
    const isUserValidOnLogin = useCallback((user) => {
        // メールアドレス
        // 空の場合不正とする
        if (!user.email || user.email.trim() === "") {
            alert(MESSAGES.VALIDATE_USER_EMAIL_EMPTY)
            return false;
        }

        // sample@example.comの形でない場合不正とする
        // ただし、「sample」「example」「com」の部分に空白もしくは@が含まれている場合も不正とする
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            alert(MESSAGES.VALIDATE_USER_EMAIL_INCORRECT_FORMAT);
            return false;
        }

        // パスワード
        // 空の場合不正とする
        if (!user.password || user.password.trim() === "") {
            alert(MESSAGES.VALIDATE_USER_PASSWORD_EMPTY);
            return false;
        }

        // 短すぎる場合不正とする
        if (user.password.length < VALIDATE_VALUES.USER_PASSWORD_MIN_LENGTH) {
            alert(MESSAGES.VALIDATE_USER_PASSWORD_TOO_SHORT);
            return false;
        }


        // 長すぎる場合不正とする
        if (user.password.length > VALIDATE_VALUES.USER_PASSWORD_MAX_LENGTH) {
            alert(MESSAGES.VALIDATE_USER_PASSWORD_TOO_LONG);
            return false;
        }


        // ここまで処理が行われる場合、内容に問題がない場合である。trueを返す。
        return true;
    }, []);

    /**
     * 登録時のユーザーの情報として適切な場合trueを返す
     * @param user 登録するユーザーの情報
     */
    const isUserValidOnRegister = useCallback((user) => {
        // ユーザー名
        // 空の場合不正とする
        if (!user.userName || user.userName.trim() === "") {
            alert(MESSAGES.VALIDATE_USER_USER_NAME_EMPTY);
            return false;
        }

        // 長すぎる場合不正とする
        if (user.userName.length > VALIDATE_VALUES.USER_USER_NAME_MAX_LENGTH) {
            alert(MESSAGES.VALIDATE_USER_USER_NAME_TOO_LONG);
            return false;
        }

        // メールアドレス、パスワードはログイン時のチェックと同じのため流用する
        if(!isUserValidOnLogin(user)){
            return false;
        }

        // ここまで処理が行われる場合、内容に問題がない場合である。trueを返す。
        return true;
    }, [isUserValidOnLogin]);

    return { isUserValidOnRegister, isUserValidOnLogin };
}