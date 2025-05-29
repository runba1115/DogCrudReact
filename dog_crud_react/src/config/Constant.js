// APIを実行するときの基本となるURL
export const API_BASE_URL = "http://localhost:8080";

// 各ページのルーティングを行うときに使用する定数
export const ROUTES = {
    POST_NEW : '/posts/new',
    POST_INDEX : '/posts/index',
    POST_SHOW : (id = ':id') => `/posts/show/${id}`,
    POST_EDIT : (id = ':id') => `/posts/edit/${id}`,
    USER_REGISTER : '/users/register',
    USER_LOGIN : '/users/login',
    NOT_MATCH : '*',
};

// バリデーションに使用する値
export const VALIDATE_VALUES = {
    // ユーザー登録、ログイン
    USER_USER_NAME_MAX_LENGTH: 20,
    USER_PASSWORD_MIN_LENGTH: 8,

    // 投稿作成、編集
    POST_TITLE_MAX_LENGTH: 8,
    POST_CONTENT_MAX_LENGTH: 100,
}

// メッセージ
export const MESSAGES = {
    // バリデーション関係のメッセージ
    // ユーザー登録、ログイン
    VALIDATE_USER_USER_NAME_EMPTY: "名前を入力してください",
    VALIDATE_USER_USER_NAME_TOO_LONG: "名前が長すぎます",
    VALIDATE_USER_EMAIL_EMPTY: "メールアドレスを入力してください",
    VALIDATE_USER_EMAIL_INCORRECT_FORMAT: "メールアドレスの形式が正しくありません",
    VALIDATE_USER_PASSWORD_EMPTY: "パスワードを入力してください",
    VALIDATE_USER_PASSWORD_TOO_SHORT: "パスワードが短すぎます",

    // 投稿作成、編集
    VALIDATE_POST_TITLE_EMPTY: "タイトルを入力してください",
    VALIDATE_POST_TITLE_TOO_LONG: "タイトルが長すぎます",
    VALIDATE_POST_CONTENT_EMPTY: "内容を入力してください",
    VALIDATE_POST_CONTENT_TOO_LONG: "内容が長すぎます",
    VALIDATE_POST_AGE_ID_EMPTY: "年齢を選択してください",
    VALIDATE_POST_IMAGE_URL_EMPTY: "画像を選択してください",


    // ユーザー関係のメッセージ
    USER_REGISTER_SUCCESSED : 'ユーザー登録に成功しました',
    USER_REGISTER_FAILED : 'ユーザー登録に失敗しました',
    ALREADY_LOGGED_IN: 'すでにログイン済みです',
    NOT_ALREADY_LOGGED_IN:  '未ログインです',
    LOG_IN_SUCCESS: 'ログインに成功しました',
    LOG_IN_FAILED: 'ログインに失敗しました',
    LOG_OUT_SUCCESS: 'ログアウトに成功しました',
    LOG_OUT_FAILED: 'ログアウトに失敗しました',

    CANT_USE_FUNCTION_DUE_TO_NOT_LOGGED_IN : '未ログインの場合この機能を使えません',
    DONT_HAVE_PROMISSION : '対象の投稿に対しこの操作を行う権限がありません',

    USER_INFO_GET_FAILED : 'ユーザー情報の取得に失敗しました',

    NO_PERMISSION: 'この操作を実行する権限がありません',

    // 投稿関係
    POST_CREATE_SUCCESSED: '投稿の作成に成功しました',
    POST_CREATE_FAILED: '投稿の作成に失敗しました',
    POST_UPDATE_SUCCESSED: '投稿の更新に成功しました',
    POST_UPDATE_FAILED: '投稿の更新に失敗しました',
    
    POST_GET_FAILED: '投稿の取得に失敗しました',
    POST_NOT_FOUND: "投稿が見つかりません（削除された可能性があります）",

    POST_EXECUTE_CONFIRM: '本当に実行しますか？',
    POST_DELETE_SUCCESSED: '削除に成功しました',
    POST_DELETE_FORBIDDEN: '削除に失敗しました\nパスワードが間違っていませんか？',
    POST_DELETE_FAILED: '削除に失敗しました',

    // 年齢関係
    AGE_GET_ERROR: '犬の年齢の一覧の取得に失敗しました',

    // 外部のAPI実行関係
    DOG_API_ERROR: '犬の画像を取得できませんでした',

    // デバッグ用メッセージ
    UNEXPECTED_ERROR: '想定していないエラーが発生しました',
    SHOW_VALIDATED_MESSAGE_WRONG_USAGE: 'デバッグ用メッセージ：showValidatedMessageの使い方が不正です'
}

// API
export const APIS={
    // ユーザー関係
    USER_REGISTER: `${API_BASE_URL}/api/users/register`,
    USER_LOGIN: `${API_BASE_URL}/login`,
    USER_LOGOUT: `${API_BASE_URL}/logout`,
    USER_GET_CURRENT: `${API_BASE_URL}/api/users/me`,

    // 投稿関係
    POST_ALL : `${API_BASE_URL}/api/posts/all`,
    POST_CREATE : `${API_BASE_URL}/api/posts`,
    POST_EDIT : (id = ':id') => `${API_BASE_URL}/api/posts/${id}`,
    POST_GET_BY_ID : (id = ':id') => `${API_BASE_URL}/api/posts/${id}`,
    POST_DELETE : (id = ':id') => `${API_BASE_URL}/api/posts/${id}`,

    // 年齢関係
    AGE_ALL : `${API_BASE_URL}/api/ages/all`,
}

//　HTTPステータスコード（fetchしたときのレスポンスに対して使用する)
export const HTTP_STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400, 
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
}

// スタイル（各画面で共通のもの）
export const COMMON_STYLE = {
    /** 画面中央に表示するオブジェクトの最大の横幅 */
    CONTAINER_MAX_WIDTH: '1000px',

    /** ユーザー登録画面など、フォーム系の最大の横幅 */
    FORM_MAX_WIDTH: '800px',

    /** 画像の最大の横幅 */
    IMAGE_MAX_WIDTH: '450px',
}