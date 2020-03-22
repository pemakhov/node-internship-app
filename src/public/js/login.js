const $loginForm = $('#login-form');
const AUTH_TOKEN_URL = 'auth/authenticate';
const USERS_URL = 'users';

$loginForm.submit((event) => {
    event.preventDefault();

    $.post(AUTH_TOKEN_URL, $loginForm.serialize())
        .then((data) => {
            document.cookie = `authorization=Bearer ${data.accessToken}`;
            document.cookie = `refresh=Bearer ${data.refreshToken}`;
            // It is not recommended to store refresh token in localStorage
            // I do it just in learning purposes, focused on backend
            // localStorage.setItem('refreshToken', data.refreshToken);
        })
        .then(() => {
            window.location.href = USERS_URL;
        });
});
