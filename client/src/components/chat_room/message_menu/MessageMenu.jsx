import React from 'react';
import styles from './message-menu.module.css';

import { Menu } from 'antd';

function MessageMenu() {
  // NOT USED
  return (
    <Menu className={styles['message-menu']} defaultSelectedKeys={[]} selectable={false}>
      <div className={styles['menu-bg']}></div>
      <Menu.Item key="1">Info</Menu.Item>
      <Menu.Item key="2">Delete</Menu.Item>
      <Menu.Item key="3">Resend</Menu.Item>
    </Menu>
  );
}

export default MessageMenu;
