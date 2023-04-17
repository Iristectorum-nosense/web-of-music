import axios from 'axios';
import cookie from 'react-cookies';
import { message } from 'antd';

const instance = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
    timeout: 5000
});

//请求拦截器
instance.interceptors.request.use(function (config) {
    const token = cookie.load('jwtToken');
    if (token) {
        config.headers.authorization = token;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

//响应拦截器
instance.interceptors.response.use(function (response) {
    if (response.data.code === 400) {
        message.error('请求参数错误,请联系网站管理员')
    } else return response;
}, function (error) {
    if (error.response) {
        let msg = ''
        switch (error.response.status) {
            case 302: msg = '接口重定向'; break;
            case 400: msg = '参数不正确'; break;
            case 401: msg = '未授权,请登录'; break;
            case 403: msg = '拒绝访问'; break;
            case 404: msg = '请求资源未找到'; break; // 在正确域名下
            case 408: msg = '请求超时'; break;
            case 409: msg = '系统已存在相同数据'; break;
            case 500: msg = '服务器内部错误'; break;
            case 501: msg = '服务未实现'; break;
            case 502: msg = '网关错误'; break;
            case 503: msg = '服务不可用'; break;
            case 504: msg = '网关超时'; break;
            case 505: msg = 'HTTP版本不受支持'; break;
            default: msg = '异常问题，请联系管理员！'; break;
        }
        message.error(msg)
    }
})

export default instance;


