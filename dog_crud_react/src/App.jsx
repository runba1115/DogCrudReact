import logo from './logo.svg';
import './App.css';
import { ROUTES } from './config/Constant';
import PostNew from './Post/PostNew';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PostIndex from './Post/PostIndex';
import PostShow from './Post/PostShow';
import PostEdit from './Post/PostEdit';
import Header from './components/Header';
import UserRegister from './User/UserRegister';
import UserLogin from './User/UserLogin';
import { useUser } from './contexts/UserContext';
import { useEffect } from 'react';

function App() {
    const {initializeUser} = useUser();
    useEffect(() => {
        // ログイン情報を取得する
        initializeUser();
    }, []);

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                {/* 投稿関係 */}
                <Route path={ROUTES.POST_INDEX} element={<PostIndex />}></Route>
                <Route path={ROUTES.POST_SHOW()} element={<PostShow />}></Route>
                <Route path={ROUTES.POST_NEW} element={<PostNew />}></Route>
                <Route path={ROUTES.POST_EDIT()} element={<PostEdit />}></Route>

                {/* ユーザー関係 */}
                <Route path={ROUTES.USER_REGISTER} element={<UserRegister />} />
                <Route path={ROUTES.USER_LOGIN} element={<UserLogin />} />

                {/* 上記以外の、不正なURLにアクセスされたら投稿一覧に遷移する */}
                <Route path={ROUTES.NOT_MATCH} elemenet={<Navigate to={ROUTES.POST_INDEX} />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
