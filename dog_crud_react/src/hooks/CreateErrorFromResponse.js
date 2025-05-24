import { useCallback } from "react";

/**
 * fetchのResponseオブジェクトから詳細付きのErrorオブジェクトを生成し、throwするためのカスタムフック
 *
 * 通常の `new Error()` ではHTTPステータスやレスポンス本文が含まれないため、
 * このフックはそれらを追加したErrorオブジェクトを作成・スローする関数を提供する。
 * @returns  createErrorFromResponse - 非同期関数。fetchのResponseを受け取り、Errorを生成してthrowする
 */
export const useCreateErrorFromResponse = () => {
    /**
     * fetchのResponseオブジェクトから詳細付きのエラーオブジェクトを生成し、throwする関数
     *
     * 通常の `new Error()` ではHTTPステータスやレスポンス本文が含まれないため、
     * この関数はそれらをErrorオブジェクトに追加して例外として扱えるようにする。
     * 非同期関数の中で `throw await createErrorFromResponse(res)` のように使う。
     * @param {Response} res - fetch API から返されたレスポンスオブジェクト（Response型）
     *
     */
    const createErrorFromResponse = useCallback(async (res) => {
        // レスポンス本文（プレーンテキスト or JSON文字列）を取得
        const body = await res.text();

        // 取得した本文とHTTPステータスを含んだメッセージでErrorオブジェクトを作成
        const error = new Error(`HTTP ${res.status} エラー: ${body}`);

        // エラーにHTTPステータスコードを追加（例: 404, 500）
        error.status = res.status;

        // エラーにレスポンス本文を追加（サーバーからのエラーメッセージなど）
        error.body = body;

        // エラーに元のレスポンスオブジェクトもまるごと含める
        error.response = res;

        // 拡張済みのErrorオブジェクトをスロー（呼び出し元でtry-catchすること）
        throw error;
    }, []);

    return createErrorFromResponse;
}