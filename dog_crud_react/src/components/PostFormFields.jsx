
import { useCallback, useEffect, useState } from "react";
import { useCreateErrorFromResponse } from "../hooks/CreateErrorFromResponse";
import { useShowErrorMessage } from "../hooks/ShowErrorMessage";
import { useGetAges } from '../hooks/GetAges';
import { MESSAGES, COMMON_STYLE, ROUTES } from '../config/Constant';
import Loading from "./Loading";
import { Autocomplete, Box, Button, Card, CardActions, CardContent, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

/**
 * 投稿作成（もしくは編集）画面の入力画面
 * @param {String} formTitle フォームのタイトル
 * @param {String} post 投稿の内容（title,content,imageUrlが格納されている値）
 * @param {Function} onSubmit フォームを送信するボタンクリック時の関数
 * @param {String} buttonLabel フォームを送信するボタンに表示する文字列
 * @returns 
 */
function PostFormFields({ formTitle, post, setPost, handleSubmit, isSubmitting, buttonLabel }) {
    const [ages, setAges] = useState([]);
    const showErrorMessage = useShowErrorMessage();
    const createErrorFromResponse = useCreateErrorFromResponse();
    const { getAges, isAgeLoading } = useGetAges();
    const [isInitialized, setIsInitialized] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prevPost => ({ ...prevPost, [name]: value }));
    }

    /**
     * ほかの犬の画像を表示するボタンがクリックされたときの処理
     */
    const handleImageChange = useCallback(async () => {
        try {
            const response = await fetch("https://dog.ceo/api/breeds/image/random");
            if (response.ok) {
                const data = await response.json();
                setPost(prevPost => ({ ...prevPost, imageUrl: data.message }));
            } else {
                createErrorFromResponse(response);
            }
        } catch (error) {
            showErrorMessage(error, MESSAGES.DOG_API_ERROR);
        }
    }, [createErrorFromResponse, showErrorMessage, setPost]);

    /**
     * 年齢や画像の取得を行う（初回のみ）
     */
    useEffect(() => {
        // 初回のみ実行するため、初期化済みフラグがtrueなら以降の処理を行わない
        // ※useEffectは第二引数の[]内を空にすることで1回のみ行われるようにできるが、第1引数の処理に影響を与えるものを第2引数に格納するのがuseEffectの記載として望ましい。
        //   その形を維持しつつ、最初の1回のみ実行される洋子の形としている。
        if (isInitialized) {
            return;
        }

        setIsInitialized(true);

        // 年齢を取得する
        const fetchAges = async () => {
            const data = await getAges();
            if (data) {
                setAges(data);
            }
        }
        fetchAges();

        // 投稿の画像のURLが設定されていない場合、ほかの犬の画像を表示するボタンがクリックされたときの処理を実行して画像を取得する
        if (!post?.imageUrl) {
            const getImageUrl = async () => {
                await handleImageChange();
            }
            getImageUrl();
        }

    }, [isInitialized, handleImageChange, post?.imageUrl, getAges]);

    // 年齢の一覧が読み込み中の場合読み込み中画面を表示する
    if (isAgeLoading) {
        return <Loading />
    }

    return (
        <Container sx={{ maxWidth: COMMON_STYLE.BODY_CONTAINER_MAX_WIDTH, m: 'auto', mb: '30px' }}>
            <Button
                variant="text"
                component={Link}
                to={ROUTES.POST_INDEX}
                sx={{ mb: '10px' }}
            >
                ＞ 一覧へ
            </Button>
            <Card
                sx={{
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <form onSubmit={handleSubmit}>
                    <CardContent sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}>

                        <Typography variant="h6">{formTitle}</Typography>
                        {/* タイトル */}
                        <TextField
                            label="タイトル"
                            variant="outlined"
                            name="title"
                            value={post.title}
                            onChange={handleChange}
                            fullWidth
                            disabled={isSubmitting}
                        />

                        {/* 内容 */}
                        <TextField
                            label="内容"
                            variant="outlined"
                            name="content"
                            multiline
                            rows={4}
                            value={post.content}
                            onChange={handleChange}
                            fullWidth
                            disabled={isSubmitting}
                        />

                        {/* 年齢（コンボボックス） */}
                        <FormControl>
                            <FormLabel>年齢</FormLabel>
                            <RadioGroup
                                row
                                name="ageId"
                                value={post.ageId}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            >
                                {ages.map((age) => (
                                    <FormControlLabel
                                        key={age.id}
                                        value={age.id}
                                        control={<Radio />}
                                        label={age.value}
                                        disabled={isSubmitting}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>

                        {/* 年齢（コンボボックス） */}
                        <Autocomplete
                            disablePortal
                            options={ages}
                            name="ageId"
                            getOptionLabel={(option) => option.value}
                            value={ages.find((age) => age.id === post.ageId) || null}
                            disabled={isSubmitting}
                            onChange={(_, newValue) => {

                                setPost(prevPost => ({
                                    ...prevPost,
                                    ageId: newValue ? newValue.id : null
                                }));
                            }}
                            // filterOptions={(options) => options}
                            renderInput={(params) => (
                                <TextField {...params} label="年齢" placeholder="選択してください" />
                            )}
                        />

                        {/* 犬の画像 */}
                        {
                            post.imageUrl ? (
                                <Box component="img" src={post.imageUrl} alt="犬の画像" sx={{ maxWidth: COMMON_STYLE.IMAGE_MAX_WIDTH, m: 'auto' }} />
                            ) : (
                                <Typography>読み込み中…</Typography>
                            )
                        }
                    </CardContent>
                    <CardActions sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}>
                        <Button variant="outlined" loading={isSubmitting}>
                            ほかの子にする
                        </Button>

                        <Button type="submit" variant="contained" loading={isSubmitting}>
                            {buttonLabel}
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </Container>
    );
}

export default PostFormFields;