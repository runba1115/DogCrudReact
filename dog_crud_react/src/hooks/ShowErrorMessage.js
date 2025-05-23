//　定数のインポートを行う
import { useCallback } from "react";
import { MESSAGES } from "../config/Constant";

/**
 * エラーメッセージ表示用のカスタムフック
 * エラーのログ出力及びメッセージの表示を行う
 * @returns showErrorMessage 引数にcatch文で使用するerror、表示するメッセージを受け取りエラーメッセージを表示する関数
 */
export const useShowErrorMessage = () => {

    /**
     * 
     * @param {Error} error catch文で使用するerror
     * @param {String} alertMessage  表示するメッセージ（指定がない場合、想定していないエラーである旨のメッセージ）
     * @returns 
     */
    const showErrorMessage = useCallback((error, alertMessage = MESSAGES.UNEXPECTED_ERROR) => {
        alert(alertMessage);
        console.error(alertMessage, error);
    }, []);

    return showErrorMessage;
}