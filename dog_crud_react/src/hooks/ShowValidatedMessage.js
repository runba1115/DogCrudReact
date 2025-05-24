//　定数のインポートを行う
import { useCallback } from "react";
import { HTTP_STATUS_CODES, MESSAGES } from "../config/Constant";

/**
 * バリデーションのエラーメッセージ表示用のカスタムフック
 * エラーのログ出力及びメッセージの表示を行う
 * @returns showErrorMessage 引数にcatch文で使用するerror、表示するメッセージを受け取りエラーメッセージを表示する関数
 */
export const useShowVaridatedMessage = () => {
    /**
     * 
     * @param {Promise<Response>} response fetchして、バリデーションエラーの際に帰ってきたresponse
     */
    const showVaridatedMessage = useCallback(async (response) => {
        // fetchしたとき、バリデーションエラーが発生した際のresponseを使用することを想定している。
        // その場合、ステータスがBAD_REQUESTであるため、その通りであることを確認する。
        if(response?.status !== HTTP_STATUS_CODES.BAD_REQUEST){
            // ステータスがBAD_REQUESTでない。不正な使用方法である。
            console.error(MESSAGES.SHOW_VALIDATED_MESSAGE_WRONG_USAGE);
            alert(MESSAGES.UNEXPECTED_ERROR);
            return;
        }

        // バリデーションのメッセージだけをつなげて表示する
        const errors = await response.json();
        const message = errors.map(error => error.message).join("\n");
        alert(message);
    }, []);

    return showVaridatedMessage;
}