import { axiosInstanceWithToken, axiosInstanceWithoutToken } from './http.js';

// 获取用户信息
export const getPlace = (data) => {
    return axiosInstanceWithoutToken.post(`/map/search`, data
    );
};

export const getWeather = (data) => {
    return axiosInstanceWithoutToken.post(`/weather/today`, data
    );
}

export const getPlan = (data) => {
    return axiosInstanceWithoutToken.post(`/map/plan`, data
    );
}

export const getAnswer = (data) => {
    return axiosInstanceWithToken.post(`/ai/answer`, data
    );
}

export const findUs = (data) => {
    return axiosInstanceWithoutToken.post(`/mail/send`, data
    );
}

export const goRegister = (data) => {
    return axiosInstanceWithoutToken.post(`/user/register`, data
    );
}

export const goLogin = (data) => {
    return axiosInstanceWithoutToken.post(`/user/login`, data
    );
}

