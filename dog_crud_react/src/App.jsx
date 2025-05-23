import logo from './logo.svg';
import './App.css';
import { ROUTES } from './config/Constant';
import PostNew from './Post/PostNew';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={ROUTES.POST_NEW} element={<PostNew />}></Route>
                <Route path={ROUTES.NOT_MATCH} elemenet={<Navigate to={ROUTES.POST_INDEX} />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
