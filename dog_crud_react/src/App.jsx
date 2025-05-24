import logo from './logo.svg';
import './App.css';
import { ROUTES } from './config/Constant';
import PostNew from './Post/PostNew';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PostIndex from './Post/PostIndex';
import PostShow from './Post/PostShow';
import PostEdit from './Post/PostEdit';
import Header from './components/Header';

function App() {
    return (
        <BrowserRouter>
            <Header 
                isAuthenticated={false}
                email={''}
            />
            <Routes>
                <Route path={ROUTES.POST_INDEX} element={<PostIndex />}></Route>
                <Route path={ROUTES.POST_SHOW()} element={<PostShow />}></Route>
                <Route path={ROUTES.POST_NEW} element={<PostNew />}></Route>
                <Route path={ROUTES.POST_EDIT()} element={<PostEdit />}></Route>
                <Route path={ROUTES.NOT_MATCH} elemenet={<Navigate to={ROUTES.POST_INDEX} />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
