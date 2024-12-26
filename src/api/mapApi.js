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

export const getChat = (data) => {
    return axiosInstanceWithToken.post(`/map/chat`, data
    );
}

export const findUs = (data) => {
    return axiosInstanceWithoutToken.post(`/mail/send`, data
    );
}

