import React, { useState } from 'react';
import styles from './ribbon.module.css';

// Antd
import { Button, Dropdown } from 'antd';

import { MoreOutlined } from '@ant-design/icons';

// Components
import Options from '../options/Options';
import TopMenu from '../top_menu/TopMenu';
import GlassDiv from '../../general/glass_div/GlassDiv';

function TopRibbon() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

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
      <Dropdown visible={isDropdownVisible} overlay={<TopMenu toggleOptions={toggleOptions} />}>
        <Button
          icon={<MoreOutlined className={styles['more-icon']} />}
          onClick={() => setDropdownState(!isDropdownVisible)}
          shape="rounded"
          size="large"
          type="text"
        />
      </Dropdown>
      <Options isVisible={isModalVisible} close={() => setIsModalVisible(false)} />
    </GlassDiv>
  );
}

export default TopRibbon;
