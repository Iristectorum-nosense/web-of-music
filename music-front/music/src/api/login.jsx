import instance from './axios.jsx';
import cookie from 'react-cookies';

//邮箱密码登录
export const loginByPw = (data, method) => {
    const url = `user/loginByPw`;
    switch (method) {
        case 'post': return instance.post(url,
            {
                loginEmail: data.loginEmail,
                loginPassword: data.loginPassword,
                remember: data.remember
            },
            {
                headers: {
                    'X-CSRFToken': cookie.load('csrftoken')
                }
            }
        );
        default:
        case 'get': return instance.get(url);
    }

};

//验证jwt令牌
export const checkJWT = (data, method) => {
    const url = `user/loginJWT`;
    switch (method) {
        case 'post': return instance.post(url,
            {
                userId: data.userId,
                email: data.email,
            },
            {
                headers: {
                    'X-CSRFToken': cookie.load('csrftoken')
                }
            }
        );
        default:
        case 'get': return instance.get(url);
    }

};