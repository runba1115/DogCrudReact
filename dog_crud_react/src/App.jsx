import logo from './logo.svg';
import './App.css';
import { ROUTES } from './config/Constant';
import PostNew from './Post/PostNew';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PostIndex from './Post/PostIndex';
import PostShow from './Post/PostShow';
import PostEdit from './Post/PostEdit';
import Header from './components/Header';
import { useGetAges } from './hooks/GetAges';
import { useEffect, useState } from 'react';

function App() {
    const getAges = useGetAges();
    const [ages, setAges] = useState([]);

    /**
     * APIを用いて年齢の一覧を取得する
     */
    useEffect(() => {
        const fetchAges = async () => {
            const data = await getAges();
            if (data) {
                setAges(data);
            }
        }

        fetchAges();
    }, [getAges]);

    return (
        ages && ages.length > 0 ? (
            <BrowserRouter>
                <Header
                    isAuthenticated={false}
                    email={''}
                />
                <Routes>
                    <Route path={ROUTES.POST_INDEX} element={<PostIndex />}></Route>
                    <Route path={ROUTES.POST_SHOW()} element={<PostShow />}></Route>
                    <Route path={ROUTES.POST_NEW} element={<PostNew ages={ages} />}></Route>
                    <Route path={ROUTES.POST_EDIT()} element={<PostEdit ages={ages} />}></Route>
                    <Route path={ROUTES.NOT_MATCH} elemenet={<Navigate to={ROUTES.POST_INDEX} />}></Route>
                </Routes>
            </BrowserRouter>)

            : (
                <p>データの取得に失敗しました。ページを再読み込みしてください。</p>
            )
    );
}

export default App;
