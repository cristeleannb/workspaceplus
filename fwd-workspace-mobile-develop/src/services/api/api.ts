import axios, {AxiosRequestConfig} from 'axios';

import {getJWT} from './api.helper';

import {REACT_APP_BASE_API_URL} from 'react-native-dotenv';

export const apiConfig: AxiosRequestConfig = {
  withCredentials: false,
  baseURL: REACT_APP_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosInstance = axios.create(apiConfig);

axiosInstance.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const jwt = await getJWT();

  const headerAuthorization: any = {};

  if (jwt) {
    headerAuthorization.Authorization = 'Bearer ' + jwt;
  }

  return {
    ...config,
    headers: {
      ...headerAuthorization,
      ...config.headers,
    },
    data: config.data || undefined,
  };
});

axiosInstance.interceptors.response.use(
  params => {
    // Add something if needed

    return {
      ...params,
    };
  },
  error => {
    return Promise.reject(error.response);
  },
);

export default axiosInstance;
