import { Link } from "react-router-dom";
import { COMMON_STYLE, ROUTES } from "../config/Constant";
import { useUser } from "../contexts/UserContext";
import PetsIcon from '@mui/icons-material/Pets';
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from "@mui/material";

/**
 * アプリケーション全体で表示されるヘッダー
 * @returns ヘッダー
 */
function Header() {
    const { userInfo, isAuthenticated, handleLogout } = useUser();

    return (
        <AppBar position="sticky" sx={{ flexGrow: 1, mb: '30px' }}>
            <Container sx={{ maxWidth: COMMON_STYLE.HEADER_CONTAINER_MAX_WIDTH }}>
                <Toolbar>
                    {/* 左側 アイコン及びアプリ名（クリック時、一覧画面に戻る） */}
                    <Button
                        component={Link}
                        to={ROUTES.POST_INDEX}
                        color="inherit"
                        size="large"
                        variant="text"
                        sx={{
                            textTransform: 'none',
                        }}
                    >
                        <PetsIcon />
                        <Typography variant="body1" sx={{ml: '10px'}}>
                            犬Crud
                        </Typography>
                    </Button>

                    {/* これにflexGrow: 1を設定することで右側に表示するオブジェクトが自動的に右に寄るようにする */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* 右側（ログイン状態によって切り替え） */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {
                            isAuthenticated ? (
                                <>
                                    <Typography variant="body1">
                                        {userInfo.userName}
                                    </Typography>
                                    <Button variant="text" color="inherit" onClick={handleLogout}>
                                        ログアウト
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="text" color="inherit" component={Link} to={ROUTES.USER_REGISTER}>
                                        新規登録
                                    </Button>
                                    <Button variant="text" color="inherit" component={Link} to={ROUTES.USER_LOGIN}>
                                        ログインする
                                    </Button>
                                </>
                            )
                        }
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;