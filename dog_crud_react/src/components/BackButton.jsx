import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { ROUTES } from "../config/Constant";

/**
 * 前の画面に戻るボタン
 * @param beforeName 前の画面の名前
 * @param path 遷移先のパス
 * @returns 前の画面に戻るボタン
 */
function BackButton({ beforeName="一覧", path=ROUTES.POST_INDEX }) {
    return (
        <Button
            variant="outlined"
            component={Link}
            to={path}
            sx={{ mb: '10px' }}
        >
            ＞ {beforeName}へ
        </Button>
    );
}

export default BackButton;