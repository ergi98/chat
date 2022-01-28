import React from "react";
import styles from "./chat.module.css";

// Components
import Message from "./Message";

const Chat = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className={styles.chat}>
      {props.messages.map((message) => (
        <Message key={message._id} message={message} />
      ))}
    </div>
  );
});

export default Chat;
