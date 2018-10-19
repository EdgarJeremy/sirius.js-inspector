import axios from 'axios';
import _ from 'lodash';

const R = function (config = {}) {
    let { url, method, body, onSuccess, onError } = config;
    method = _.lowerCase(method);
    let options = {
        headers: {
            'x-access-token': localStorage.getItem('accessToken'),
            'x-refresh-token': localStorage.getItem('refreshToken'),
            'x-socket-id': localStorage.getItem('socketid')
        }
    }
    if (method === 'post' || method === 'put') {
        axios[method](url, body, options).then(successHandler).then(onSuccess).catch(onError);
    } else {
        axios[method](url, { ...options }).then(onSuccess).catch(onError);
    }
}

const successHandler = function (res) {
    console.log(res);
    if (res.headers['x-access-token'] && res.headers['x-refresh-token']) {
        localStorage.setItem('accessToken', res.headers['x-access-token']);
        localStorage.setItem('refreshToken', res.headers['x-refresh-token']);
    }
    return res;
}

export default R;