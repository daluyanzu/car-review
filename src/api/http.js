﻿import axios from 'axios';

// 创建需要 token 的 Axios 实例
const axiosInstanceWithToken = axios.create({
  baseURL: '/api', // 替换为你的 API 基础 URL
  timeout: 10000, // 请求超时时间
  headers: { 'Content-Type': 'application/json' }
});

// 请求拦截器
axiosInstanceWithToken.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
        return Promise.reject({
            response: {
              status: 400,
              data: 'Token 不存在，请先登录'
            }
          });
      }
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstanceWithToken.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response.data;
  },
  error => {
    // 对响应错误做点什么
    if (error.response) {
      // 请求已发出，但服务器响应状态不在 2xx 范围
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
      console.error('Error Response Headers:', error.response.headers);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('Error Request Data:', error.request);
    } else {
      // 发生在设置请求时的错误
      console.error('Error Message:', error.message);
    }
    return Promise.reject(error);
  }
);

// 创建不需要 token 的 Axios 实例
const axiosInstanceWithoutToken = axios.create({
  baseURL: '/api', // 替换为你的 API 基础 URL
  timeout: 10000, // 请求超时时间
  headers: { 'Content-Type': 'application/json' }
});

// 响应拦截器
axiosInstanceWithoutToken.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response.data;
  },
  error => {
    // 对响应错误做点什么
    if (error.response) {
      // 请求已发出，但服务器响应状态不在 2xx 范围
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
      console.error('Error Response Headers:', error.response.headers);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('Error Request Data:', error.request);
    } else {
      // 发生在设置请求时的错误
      console.error('Error Message:', error.message);
    }
    return Promise.reject(error);
  }
);

export { axiosInstanceWithToken, axiosInstanceWithoutToken };