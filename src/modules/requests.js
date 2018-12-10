import axios from 'axios';
import _ from 'lodash';

const R = function (config = {}) {
    let { url, method, body, onSuccess, onError } = config;
    method = _.lowerCase(method);
    let options = {
        headers: {
            'x-access-token': localStorage.getItem('devAccessToken'),
            'x-refresh-token': localStorage.getItem('devRefreshToken'),
            'x-socket-id': localStorage.getItem('devSocketid')
        }
    }
    if (method === 'post' || method === 'put') {
        axios[method](url, body, options).then(successHandler).then(onSuccess).catch(onError);
    } else {
        axios[method](url, { ...options }).then(successHandler).then(onSuccess).catch(onError);
    }
}

const successHandler = function (res) {
    if ('x-access-token' in res.headers && 'x-refresh-token' in res.headers) {
        localStorage.setItem('devAccessToken', res.headers['x-access-token']);
        localStorage.setItem('devRefreshToken', res.headers['x-refresh-token']);
    }
    const data = res.data;
    if (data.data) {
        if(data.data.tokens) {
            if (data.data.tokens.token) {
                localStorage.setItem('devAccessToken', data.data.tokens.token);
            }
            if (data.data.tokens.refreshToken) {
                localStorage.setItem('devRefreshToken', data.data.tokens.refreshToken);
            }
        }
    }
    return res;
}

export default R;