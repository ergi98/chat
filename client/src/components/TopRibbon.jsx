import React from "react";
import styles from "./ribbon.module.css";

// Antd
import { Button } from "antd";

import { MoreOutlined } from "@ant-design/icons";

// Components
import GlassDiv from "./GlassDiv";

function TopRibbon() {
  return (
    <GlassDiv className={styles.top}>
      <div>Chat Room</div>
      <Button
        type="text"
        size="large"
        shape="rounded"
        icon={<MoreOutlined className={styles["more-icon"]} />}
      />
    </GlassDiv>
  );
}

export default TopRibbon;
