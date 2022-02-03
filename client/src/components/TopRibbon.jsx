import React, { useState } from "react";
import styles from "./ribbon.module.css";

// Antd
import { Button, Dropdown } from "antd";

import { MoreOutlined } from "@ant-design/icons";

// Components
import GlassDiv from "./GlassDiv";
import TopMenu from "./TopMenu";

function TopRibbon() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  function toggleMenu() {
    setIsModalVisible((prev) => !prev);
  }
  
  return (
    <GlassDiv className={styles.top}>
      <div>Chat Room</div>
      <Button
        onClick={toggleMenu}
        icon={<MoreOutlined className={styles["more-icon"]} />}
        shape="rounded"
        size="large"
        type="text"
      />
      <TopMenu isVisible={isModalVisible} />
    </GlassDiv>
  );
}

export default TopRibbon;
