import { render } from "react-dom";

import { ConfigProvider } from "antd";

// CSS
import "antd/dist/antd.variable.min.css";
import "./styles/index.css";

// Components
import App from "./App";

// Axios
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5050/";

let jwt = JSON.parse(localStorage.getItem("jwt"));

if (jwt) {
  axios.interceptors.request.use((config) => {
    config.headers.authorization = `Bearer ${jwt}`;
    return config;
  });
}

ConfigProvider.config({
  theme: {
    primaryColor: "#533deb",
  },
});

render(<App />, document.getElementById("root"));
