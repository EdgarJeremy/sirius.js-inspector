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
    if (res.headers['x-access-token'] && res.headers['x-refresh-token']) {
        localStorage.setItem('devAccessToken', res.headers['x-access-token']);
        localStorage.setItem('devRefreshToken', res.headers['x-refresh-token']);
    }
    const data = res.data;
    if (data.data) {
        if (data.data.token) {
            localStorage.setItem('devAccessToken', data.data.token);
        }
        if (data.data.refreshToken) {
            localStorage.setItem('devRefreshToken', data.data.refreshToken);
        }
    }
    return res;
}

export default R;