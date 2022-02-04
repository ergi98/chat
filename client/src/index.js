import { render } from "react-dom";

import { ConfigProvider } from "antd";

// CSS
import "antd/dist/antd.variable.min.css";
import "./styles/index.css";

// Components
import App from "./App";

ConfigProvider.config({
  theme: {
    primaryColor: "var(--primary)",
  },
});

render(<App />, document.getElementById("root"));
