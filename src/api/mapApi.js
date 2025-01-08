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

export const checkDuplicate = (data) => {
    return axiosInstanceWithoutToken.post(`/user/checkDuplicate`, data
    );
}

export const sendCode = (data) => {
    return axiosInstanceWithoutToken.post(`/sms/sendCode`, data
    );
}

export const getCaptcha = (data) => {
    return axiosInstanceWithoutToken.post(`/captcha`, data
    );
}

export const searchCar = (data) => {
    return axiosInstanceWithoutToken.post(`/rv/search`, data
    );
}



