import React, { useState } from "react";
import styles from "./send.module.css";

import { Input, Button } from "antd";
import { SendOutlined, AudioOutlined, CameraOutlined } from "@ant-design/icons";
import GlassDiv from "./GlassDiv";

const { TextArea } = Input;

const Send = React.forwardRef((props, ref) => {
  const [userInput, setUserInput] = useState(null);

  async function submitMessage(event) {
    event.preventDefault();
    if (typeof userInput === "string" && userInput !== "")
      await props.addMessage(userInput);
    setUserInput(null);
  }

  /**
   * TODO:
   *  1. Implement forwards ref in glassDiv component
   *  2. Make GlassDiv accept class props
   *
   *
   */

  return (
    <GlassDiv className={styles.container}>
      <form ref={ref} onSubmit={submitMessage} className={styles.form}>
        <Button
          className={styles["action-button"]}
          onClick={submitMessage}
          icon={<CameraOutlined />}
          shape="circle"
          size="large"
          type="text"
        />
        <Button
          className={styles["action-button"]}
          onClick={submitMessage}
          icon={<AudioOutlined />}
          shape="circle"
          size="large"
          type="text"
        />
        <div className={styles["input-container"]}>
          <TextArea
            value={userInput}
            onPressEnter={submitMessage}
            onChange={(event) => setUserInput(event.target.value)}
            autoSize={{ minRows: 1, maxRows: 6 }}
            bordered={false}
            className={styles["input-field"]}
            placeholder="Write something..."
          />
          <Button
            onClick={submitMessage}
            icon={<SendOutlined />}
            shape="circle"
            size="large"
            type="primary"
          />
        </div>
      </form>
    </GlassDiv>
  );
});

export default Send;
