import React, { useState } from "react";
import styles from "./send.module.css";

import { Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const Send = React.forwardRef((props, ref) => {
  const [userInput, setUserInput] = useState(null);

  async function submitMessage(event) {
    event.preventDefault();
    await props.setMessage(userInput);
    setUserInput(null);
  }

  return (
    <div ref={ref} className={styles.send}>
      <form onSubmit={submitMessage}>
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
            className={styles["submit-button"]}
            onClick={submitMessage}
            icon={<SendOutlined />}
            shape="circle"
            type="primary"
          />
        </div>
      </form>
    </div>
  );
});

export default Send;
