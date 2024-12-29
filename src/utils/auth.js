

  export const getToken = (data) => {
    const token = localStorage.getItem('token');
    if (token) {
        return token;
    } else {
        return null;
    }
};

export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const removeToken = () => {
    localStorage.removeItem('token');
};