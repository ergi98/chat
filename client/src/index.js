import { render } from "react-dom";

import { ConfigProvider } from "antd";

// CSS
import "antd/dist/antd.variable.min.css";
import "./styles/index.css";

// Components
import App from "./App";

// Axios
import { setTokenInterceptor } from "../axios_config/axios-config";

(function () {
  console.log("%c IndexJS anonymous function", "color: #55dab2");
  let jwt = JSON.parse(localStorage.getItem("jwt"));
  setTokenInterceptor(jwt);
})();

ConfigProvider.config({
  theme: {
    primaryColor: "#533deb",
  },
});

render(<App />, document.getElementById("root"));
