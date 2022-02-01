import React, { useState, useRef, useEffect } from "react";
import styles from "./send.module.css";

import { Input, Button, message } from "antd";
import { SendOutlined, AudioOutlined, CameraOutlined } from "@ant-design/icons";

// Components
import GlassDiv from "./GlassDiv";

const { TextArea } = Input;

const Send = React.forwardRef((props, ref) => {
  const [userInput, setUserInput] = useState(null);

  const inputRef = useRef(null);

  async function submitMessage(event) {
    event.preventDefault();
    inputRef.current.focus();
    if (typeof userInput === "string" && userInput !== "")
      await props.addMessage(userInput);
    setUserInput(null);
  }
  
  return (
    <GlassDiv ref={ref} className={styles.container}>
      <form onSubmit={submitMessage} className={styles.form}>
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
            ref={inputRef}
            onFocus={props.scrollToBottom}
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
