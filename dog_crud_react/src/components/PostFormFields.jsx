
import { useCallback, useEffect, useState } from "react";
import { useCreateErrorFromResponse } from "../hooks/CreateErrorFromResponse";
import { useShowErrorMessage } from "../hooks/ShowErrorMessage";
import { useGetAges } from '../hooks/GetAges';
import { MESSAGES, COMMON_STYLE } from '../config/Constant';
import Loading from "./Loading";
import { Autocomplete, Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";

/**
 * 投稿作成（もしくは編集）画面の入力画面
 * @param {String} formTitle フォームのタイトル
 * @param {String} post 投稿の内容（title,content,imageUrlが格納されている値）
 * @param {Function} onSubmit フォームを送信するボタンクリック時の関数
 * @param {String} buttonLabel フォームを送信するボタンに表示する文字列
 * @returns 
 */
function PostFormFields({ formTitle, post, setPost, onSubmit, buttonLabel }) {
    const [ages, setAges] = useState([]);
    const showErrorMessage = useShowErrorMessage();
    const createErrorFromResponse = useCreateErrorFromResponse();
    const { getAges, isAgeLoading } = useGetAges();

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

    useEffect(() => {
        // 年齢を取得する
        const fetchAges = async () => {
            const data = await getAges();
            if (data) {
                setAges(data);
            }
        }
        fetchAges();

        // 投稿の画像のURLが設定されていない場合、ほかの犬の画像を表示するボタンがクリックされたときの処理を実行して
        if (!post?.imageUrl) {
            const getImageUrl = async () => {
                await handleImageChange();
            }
            getImageUrl();
        }

    }, [handleImageChange, post?.imageUrl, getAges]);

    // 年齢の一覧が読み込み中の場合読み込み中画面を表示する
    if (isAgeLoading) {
        return <Loading />
    }

    return (
        <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
                maxWidth: COMMON_STYLE.CONTAINER_MAX_WIDTH,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                m: 'auto'
            }}
        >
            <Typography variant="h6">{formTitle}</Typography>
            {/* タイトル */}
            <TextField
                label="タイトル"
                variant="outlined"
                name="title"
                value={post.title}
                onChange={handleChange}
                fullWidth
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
            />

            {/* 年齢（コンボボックス） */}
            <FormControl>
                <FormLabel>年齢</FormLabel>
                <RadioGroup
                    row
                    name="ageId"
                    value={post.ageId}
                    onChange={handleChange}
                >
                    {ages.map((age)=>(
                        <FormControlLabel
                            key={age.id}
                            value={age.id}
                            control={<Radio />}
                            label={age.value}
                        />
                    ))}
                </RadioGroup>
            </FormControl>

            {/* 年齢（コンボボックス） */}
            <Autocomplete
                disablePortal
                options={ages}
                getOptionLabel={(option) => option.value}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} label="年齢" />}
            />

            {/* 犬の画像 */}
            {
                post.imageUrl ? (
                    <Box component="img" src={post.imageUrl} alt="犬の画像" />
                ) : (
                    <Typography>読み込み中…</Typography>
                )
            }

            <Button variant="outlined" onClick={handleImageChange}>
                ほかの子にする
            </Button>

            <Button type="submit" variant="contained">
                投稿する
            </Button>
        </Box>
    );
}

export default PostFormFields;