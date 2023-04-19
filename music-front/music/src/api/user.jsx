import instance from './axios.jsx';
import cookie from 'react-cookies';

//发送邮箱验证码
export const sendCaptcha = (data, method) => {
    const url = `captcha`;
    switch (method) {
        case 'loginEmailByCap': return instance.get(url, { params: { loginEmail: data } });
        case 'registerEmail': return instance.get(url, { params: { registerEmail: data } });
        default: return;
    }
}

//邮箱验证码登录
export const loginByCap = (data, method) => {
    const url = `user/loginByCap`;
    switch (method) {
        case 'post': return instance.post(url,
            {
                loginEmail: data.loginEmail,
                loginCaptcha: data.loginCaptcha,
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

//注册
export const register = (data, method) => {
    const url = `user/register`;
    switch (method) {
        case 'post': return instance.post(url,
            {
                registerEmail: data.registerEmail,
                nickName: data.nickName,
                gender: data.gender,
                registerPassword: data.registerPassword,
                registerCaptcha: data.registerCaptcha,
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
// export const checkJWT = (data, method) => {
//     const url = `user/loginJWT`;
//     switch (method) {
//         case 'post': return instance.post(url,
//             {
//                 userId: data.userId,
//                 email: data.email,
//             },
//             {
//                 headers: {
//                     'X-CSRFToken': cookie.load('csrftoken')
//                 }
//             }
//         );
//         default:
//         case 'get': return instance.get(url);
//     }

// };