import React from "react";
import styles from "./options.module.css";

// ANTD
import { Switch, Modal, Button } from "antd";

// Icons
import { CloseOutlined } from "@ant-design/icons";

function Options({ isVisible, close }) {
  function onThemeChange(event) {
    switch (event) {
      case true:
        break;
      case false:
        break;
    }
  }

  return (
    <Modal
      title={
        <div className={styles["modal-header"]}>
          <div className={styles["header-content"]}>
            <div>Chat Options</div>
            <Button
              onClick={() => close()}
              icon={<CloseOutlined className={styles["close-icon"]} />}
              shape="circle"
              type="text"
            />
          </div>
          <hr className={styles.divider} />
        </div>
      }
      footer={null}
      closable={false}
      maskClosable={true}
      visible={isVisible}
      autoFocusButton={null}
      bodyStyle={{
        background: "var(--dark-bg)",
      }}
      maskStyle={{
        background: "var(--overlay)",
      }}
      onCancel={() => close()}
    >
      <div className={styles.menu}>
        <div className={styles["text"]}>Toggle Dark Mode</div>
        <Switch defaultChecked onChange={onThemeChange} />
      </div>
    </Modal>
  );
}

export default Options;
