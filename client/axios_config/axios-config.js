// Axios
import axios from 'axios';

const AxiosInstance = axios.create();

// eslint-disable-next-line no-undef
AxiosInstance.defaults.baseURL = process.env.REACT_APP_PROXY;

function addResponseInterceptors(successCallback, errorCallback) {
  AxiosInstance.interceptors.response.use(successCallback, errorCallback);
}

function setTokenInterceptor(token, refreshToken) {
  if (token) {
    AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    AxiosInstance.defaults.headers.common['Refresh'] = `Bearer ${refreshToken}`;
  }
}

function clearAxiosInstance() {
  delete AxiosInstance.defaults.headers.common['Authorization'];
  delete AxiosInstance.defaults.headers.common['Refresh'];
}

export { AxiosInstance, addResponseInterceptors, setTokenInterceptor, clearAxiosInstance };
