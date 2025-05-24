import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // React.StrictMode は、開発中に非推奨なAPIの使用や副作用の不備を検出するため、
    // useEffect などの副作用処理をあえて「マウント→アンマウント→再マウント」して動作確認する。
    // そのため、開発中（npm start 時）には useEffect の中の処理が2回実行されるように見えることがある。
    //
    // ただし、npm run build で本番用にビルドした後、npx serve -s build などで表示した場合は、
    // React.StrictMode が残っていても実際の副作用処理は 1 回だけ実行され、本番に近い挙動になる。
    // <React.StrictMode>
        <App />
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
