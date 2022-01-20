import { render } from "react-dom";

import "antd/dist/antd.variable.min.css";
import { ConfigProvider } from "antd";

import "./styles/index.css";

// Components
import App from "./App";

ConfigProvider.config({
  theme: {
    primaryColor: "#533deb",
  },
});

render(<App />, document.getElementById("root"));
