import { useCallback } from "react";
import { APIS, HTTP_STATUS_CODES, MESSAGES } from "../config/Constant";
import { useShowErrorMessage } from "./ShowErrorMessage";
import { useShowValidatedMessage } from "./ShowValidatedMessage";

/**
 * 年齢の情報をすべて取得するAPIを実行する関数を返すカスタムフック
 * @returns useGetAges 年齢の情報をすべて取得するAPIを実行する関
 */
export const useGetAges = () => {
    const showErrorMessage = useShowErrorMessage();
    const showValidatedMessage = useShowValidatedMessage();

    const getAges = useCallback(async () => {
        try {
            const response = await fetch(APIS.AGE_ALL);
            if (response.ok) {
                const data = await response.json();

                // 年齢を取得できたため返す。
                return data;
            }
            else {
                if (response.status === HTTP_STATUS_CODES.BAD_REQUEST) {
                    await showValidatedMessage(response);
                }
            }
        } catch (error) {
            showErrorMessage(error);
        }

        // 年齢を取得できなかった。nullを返す。
        return null;
    }, [showErrorMessage, showValidatedMessage]);


    return getAges;
}