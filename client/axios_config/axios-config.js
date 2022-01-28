// Axios
import axios from "axios";

const AxiosInstance = axios.create();

AxiosInstance.defaults.baseURL = `http://${window.location.hostname}:5050/`;

function setTokenInterceptor(token) {
  if (token) {
    AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

function clearAxiosInstance() {
  delete AxiosInstance.defaults.headers.common["Authorization"];
}

export { AxiosInstance, setTokenInterceptor, clearAxiosInstance };
