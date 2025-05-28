import { Box, CircularProgress, Typography } from "@mui/material";

/**
 * 読み込み中の表示
 * @returns 
 */
function Loading() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            gap={2}
        >
            <CircularProgress />
            <Typography variant="body1">読み込み中です…</Typography>
        </Box>
    );
}

export default Loading;