import axiosClient from './axiosClient';

const authApi = {
    signup: (data) => axiosClient.post('/user/signup', data),
    login: (data) => axiosClient.post('/user/login', data),
};

export default authApi;
