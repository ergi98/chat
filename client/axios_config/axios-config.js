// Axios
import axios from 'axios';

const AxiosInstance = axios.create();

// eslint-disable-next-line no-undef
AxiosInstance.defaults.baseURL = process.env.REACT_APP_PROXY;

AxiosInstance.interceptors.response.use(successInterceptor, errorInterceptor);

const successInterceptor = (res) => res;
const errorInterceptor = (err) => {
  console.dir(err);
  return err;
};

function setTokenInterceptor(token) {
  if (token) {
    AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

function clearAxiosInstance() {
  delete AxiosInstance.defaults.headers.common['Authorization'];
}

export { AxiosInstance, setTokenInterceptor, clearAxiosInstance };
