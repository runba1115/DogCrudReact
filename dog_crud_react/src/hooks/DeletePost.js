//　定数のインポートを行う
import { useCallback } from "react";
import { API_BASE_URL, APIS, HTTP_STATUS_CODES, MESSAGES, ROUTES } from "../config/Constant";

// 共通のエラー生成ユーティリティ関数をimportする
import { useCreateErrorFromResponse } from './CreateErrorFromResponse';
import { useShowErrorMessage } from "./ShowErrorMessage";
import { useBlockIfNotCreater } from "./BlockIfNotCreater";
import { useNavigate } from "react-router-dom";

/**
 * 
 * 投稿削除用のカスタムフック
 * ユーザーに確認ダイアログを表示し、OKが押されたらAPIを通じて投稿を削除する
 *
 * @param {Function} onSuccess 削除成功時に行う処理
 * @returns deletePost - 引数に投稿IDを受け取り、削除処理を実行する非同期関数
 */
export const useDeletePost = (onSuccess = () => { }) => {
    const createErrorFromResponse = useCreateErrorFromResponse();
    const showErrorMessage = useShowErrorMessage();
    const blockIfNotCreater = useBlockIfNotCreater();
    const navigate = useNavigate();


    /**
     * 投稿削除処理を実行する非同期関数
     *
     * @param {number|string} id - 削除対象の投稿ID（数値 or 文字列）
     */
    const deletePost = useCallback(async (id) => {
        

        // 投稿を削除する前に、その投稿の作者とログインしているユーザーが一致しているかを確認する必要がある。
        // 投稿を取得する
        try {
            // 投稿詳細の取得APIを呼び出す
            const res = await fetch(`${API_BASE_URL}${APIS.POST_GET_BY_ID(id)}`);

            if (res.ok) {
                // 正常なレスポンスの場合、JSONデータを取得する
                const targetPost = await res.json();

                // 投稿の作者でなければブロックする（一覧画面へ戻す）
                if(blockIfNotCreater(targetPost)){
                    // ブロックしたため以降の処理を行わない
                    return;
                }
            } else {
                if (res.status === HTTP_STATUS_CODES.NOT_FOUND) {
                    // 投稿が見つからなかった
                    // その旨を表示し一覧画面に遷移する
                    alert(MESSAGES.POST_NOT_FOUND);
                    navigate(ROUTES.POST_INDEX);
                    return;
                }

                // 想定外のステータスコードの場合、エラーを発生させる
                throw await createErrorFromResponse(res);
            }
        } catch (error) {
            // ネットワークエラーまたはthrowされたErrorをキャッチ
            showErrorMessage(error, MESSAGES.POST_GET_FAILED)
            navigate(ROUTES.POST_INDEX);
            return;
        }

        // 以下の処理が行われるのは、投稿の作者とログインしているユーザーが一致している場合である

        // 削除確認ダイアログの表示を行う（キャンセルされたら中断）
        if (!window.confirm(MESSAGES.DELETE_CONFIRM)) {
            return;
        }

        try {
            // 指定IDの投稿に対して DELETE リクエストを送信する
            const res = await fetch(`${API_BASE_URL}${APIS.POST_DELETE(id)}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                //レスポンスが成功（200系）の場合
                alert(MESSAGES.DELETE_SUCCESSED);
                onSuccess();
            }
            else {
                //想定外のエラー応答があった場合は共通関数でErrorオブジェクト生成する
                throw await createErrorFromResponse(res);
            }
        }
        catch (error) {
            // ネットワークエラー or 明示的にthrowされたErrorをキャッチする
            showErrorMessage(error, MESSAGES.DELETE_FAILED)
        }
    }, [onSuccess, createErrorFromResponse, showErrorMessage, blockIfNotCreater, navigate]);

    // このフックの戻り値として、削除関数そのものを返す
    return deletePost;
}