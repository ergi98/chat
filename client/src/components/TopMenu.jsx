import React from "react";
import styles from "./top-menu.module.css";

// ANTD
import { Menu } from "antd";

// Icons
import { ToolOutlined, LogoutOutlined } from "@ant-design/icons";

function TopMenu(props) {
  function handleMenuItemClick({ key }) {
    switch (key) {
      case "options":
        props.toggleOptions();
        break;
      case "leave":
        handleChatLeave();
        break;
    }
  }

  function handleChatLeave() {
    console.log("leaving chat")
  }

  return (
    <Menu
      selectable={false}
      className={styles.menu}
      onClick={handleMenuItemClick}
    >
      <Menu.Item key="options" className={styles["menu-item"]}>
        <div>Options</div>
        <ToolOutlined />
      </Menu.Item>
      <Menu.Item key="leave" className={styles["menu-item"]}>
        <div>Leave Chat</div>
        <LogoutOutlined />
      </Menu.Item>
    </Menu>
  );
}

export default TopMenu;
