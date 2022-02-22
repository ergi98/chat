// Axios
import axios from 'axios';

const AxiosInstance = axios.create();

AxiosInstance.defaults.baseURL = `http://${window.location.hostname}:5050/`;
AxiosInstance.interceptors.response.use(successInterceptor, errorInterceptor);

const successInterceptor = (res) => res;
const errorInterceptor = (err) => err;

function setTokenInterceptor(token) {
  if (token) {
    AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

function clearAxiosInstance() {
  delete AxiosInstance.defaults.headers.common['Authorization'];
}

export { AxiosInstance, setTokenInterceptor, clearAxiosInstance };
