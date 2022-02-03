import React from "react";
import styles from "./top-menu.module.css";

// ANTD
import { Menu, Switch, Modal } from "antd";

function TopMenu({ isVisible }) {
  function onThemeChange() {
    console.log("changed themes");
  }

  return (
    <Modal
      visible={isVisible}
      footer={null}
      autoFocusButton={null}
      className={styles["modal-body"]}
      wrapClassName={styles["modal-overlay"]}
      closable={true}
      maskClosable={true}
    >
      <Menu className={styles.menu}>
        <Menu.Item className={styles["menu-item"]}>
          <div className={styles["theme-menu"]}>
            <div className={`${styles["theme-text"]} ${styles["menu-text"]}`}>
              Toggle Dark Mode
            </div>
            <Switch defaultChecked onChange={onThemeChange} />
          </div>
        </Menu.Item>
        <Menu.Item className={`${styles["menu-text"]} ${styles["menu-item"]}`}>
          Leave Group
        </Menu.Item>
      </Menu>
    </Modal>
  );
}

export default TopMenu;
