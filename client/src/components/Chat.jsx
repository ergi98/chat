import React from "react";
import styles from "./chat.module.css";
import Message from "./Message";

// let myId = "1";

// let message = {
//   sentBy: "123123",
//   members: [
//     {
//       user_id: "1",
//       deliveredAt: new Date(),
//       seenAt: new Date(),
//     },
//   ],
//   text: "Pesembedhjet karaktere ore ti shoku im hahha",
//   sentAt: new Date(),
// };

// let myMessage = {
//   sentBy: myId,
//   members: [
//     {
//       user_id: "123123",
//       deliveredAt: new Date(),
//       seenAt: new Date(),
//     },
//   ],
//   text: "Ca behet si je si ja kalon nga shpia mir?",
//   sentAt: new Date(),
// };

// let messages = Array(100).fill(message);

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
