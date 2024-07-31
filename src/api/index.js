import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_ENDPOINT,
    timeout: 5000,
});

const makeApiRequest = (method, url) => (payload) => {
    if (method === 'post') return instance.post(url, payload);
    return instance.get(url, payload);
};

// ----- Methods -----

export const apiGetBriefList = makeApiRequest('get', '/api/brief/list');

export const apiSendViewedBulletinList = makeApiRequest('post', '/api/brief/review');
