import React, { useState } from "react";
import styles from "./ribbon.module.css";

// Antd
import { Button, Dropdown } from "antd";

import { MoreOutlined } from "@ant-design/icons";

// Components
import Options from "./Options";
import TopMenu from "./TopMenu";
import GlassDiv from "./GlassDiv";

function TopRibbon() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  function toggleOptions() {
    setDropdownState(false);
    setTimeout(() => setIsModalVisible((prev) => !prev), 300);
  }

  function setDropdownState(value) {
    setIsDropdownVisible(value);
  }

  return (
    <GlassDiv className={styles.top}>
      <div>Chat Room</div>
      <Dropdown
        visible={isDropdownVisible}
        overlay={<TopMenu toggleOptions={toggleOptions} />}
      >
        <Button
          icon={<MoreOutlined className={styles["more-icon"]} />}
          onClick={() => setDropdownState(!isDropdownVisible)}
          shape="rounded"
          size="large"
          type="text"
        />
      </Dropdown>
      <Options
        isVisible={isModalVisible}
        close={() => setIsModalVisible(false)}
      />
    </GlassDiv>
  );
}

export default TopRibbon;
