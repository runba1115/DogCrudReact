//　定数のインポートを行う
import { MESSAGES } from "../config/Constant";
import { useDeletePost } from "./DeletePost";

/**
 * バリデーションのエラーメッセージ表示用のカスタムフック
 * エラーのログ出力及びメッセージの表示を行う
 * @param userInfo ログイン中のユーザー情報
 * @returns showErrorMessage 引数にcatch文で使用するerror、表示するメッセージを受け取りエラーメッセージを表示する関数
 */
export const usePostActions = (userInfo) => {
    const deletePost = useDeletePost(useCallback(() => { getPosts(); }, []));

    /**
     * 詳細ボタン押下時に呼ばれる関数
     * 指定IDの投稿の詳細画面へ遷移する
     *
     * @param post 表示対象の投稿
     */
    const handleShow = (post) => {
        navigate(ROUTES.POST_SHOW(post.id));
    }

    /**
     * 編集ボタン押下時に呼ばれる関数
     * 指定IDの投稿の編集画面へ遷移する
     *
     * @param post 編集対象の投稿
     */
    const handleEdit = (post) => {
        // 投稿の作者とログインしているユーザーが一致しない場合、編集画面へ遷移しない
        if(post.userId !== userInfo?.id){
            alert(MESSAGES.NO_PERMISSION);
            return;
        }

        navigate(ROUTES.POST_EDIT(post.id));
    }

    /**
     * 削除ボタン押下時に呼ばれる関数
     * 指定IDの投稿を削除した後、投稿一覧を再取得して画面を更新する
     *
     * @param post 削除対象の投稿
     */
    const handleDelete = async (post) => {
        // 投稿の作者とログインしているユーザーが一致しない場合、削除を実行しない
        if(post.userId !== userInfo?.id){
            alert(MESSAGES.NO_PERMISSION);
            return;
        }

        await deletePost(post.id);
    }

    return {handleShow, handleEdit, handleDelete};
}