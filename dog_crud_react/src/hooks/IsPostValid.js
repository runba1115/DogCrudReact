//　定数のインポートを行う
import { useCallback } from "react";
import { MESSAGES, VALIDATE_VALUES } from "../config/Constant";

/**
 * バリデーションのエラーメッセージ表示用のカスタムフック
 * エラーのログ出力及びメッセージの表示を行う
 * @returns showErrorMessage 引数にcatch文で使用するerror、表示するメッセージを受け取りエラーメッセージを表示する関数
 */
export const useIsPostValid = () => {

    /**
     * 投稿を作成、更新する際の値として適切な場合trueを返す
     * @param post 登録する投稿の情報
     */
    const isPostValid = useCallback((post) => {
        // タイトル
        // 空の場合不正とする
        if (!post.title || post.title.trim() === "") {
            alert(MESSAGES.VALIDATE_POST_TITLE_EMPTY)
            return false;
        }

        // 長すぎる場合不正とする
        if (post.title.length > VALIDATE_VALUES.POST_TITLE_MAX_LENGTH) {
            alert(MESSAGES.VALIDATE_POST_TITLE_TOO_LONG);
            return false;
        }

        // 内容
        // 空の場合不正とする
        if (!post.content || post.content.trim() === "") {
            alert(MESSAGES.VALIDATE_POST_CONTENT_EMPTY)
            return false;
        }

        // 長すぎる場合不正とする
        if (post.content.length > VALIDATE_VALUES.POST_CONTENT_MAX_LENGTH) {
            alert(MESSAGES.VALIDATE_POST_CONTENT_TOO_LONG);
            return false;
        }

        // 年齢
        // 空の場合不正とする
        if (!post.ageId) {
            alert(MESSAGES.VALIDATE_POST_AGE_ID_EMPTY)
            return false;
        }

        // 画像のURL
        // 空の場合不正とする
        if (!post.imageUrl || post.imageUrl.trim() === "") {
            alert(MESSAGES.VALIDATE_POST_IMAGE_URL_EMPTY)
            return false;
        }

        // ここまで処理が行われる場合、内容に問題がない場合である。trueを返す。
        return true;
    }, []);

    return isPostValid;
}