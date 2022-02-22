import React, { useState } from 'react';
import styles from './top-menu.module.css';

// Mongo
import { removeUserFromRoom } from '../../../mongo/room';

// Context
import { useRootUpdate } from '../../../RootContext.js';

// ANTD
import { Menu } from 'antd';

// Router
import { useNavigate } from 'react-router-dom';

// Axios
import { clearAxiosInstance } from '../../../../axios_config/axios-config';

// Icons
import { ToolOutlined, LogoutOutlined, LoadingOutlined } from '@ant-design/icons';

function TopMenu(props) {
  const navigate = useNavigate();

  const updateRootData = useRootUpdate();

  const [isLeaving, setIsLeaving] = useState(false);

  function handleMenuItemClick({ key }) {
    switch (key) {
      case 'options':
        props.toggleOptions();
        break;
      case 'leave':
        handleChatLeave();
        break;
    }
  }

  async function handleChatLeave() {
    try {
      setIsLeaving(true);
      await removeUserFromRoom();
      clearAxiosInstance();
      localStorage.clear();
      updateRootData(null);
      navigate(`/`, { replace: true });
    } catch (err) {
      console.log('Error', err);
    } finally {
      setIsLeaving(false);
    }
  }

  return (
    <Menu selectable={false} className={styles.menu} onClick={handleMenuItemClick}>
      <Menu.Item disabled={isLeaving} key="options" className={styles['menu-item']}>
        <div>Options</div>
        <ToolOutlined />
      </Menu.Item>
      <Menu.Item disabled={isLeaving} key="leave" className={styles['menu-item']}>
        <div>Leave Chat</div>
        {isLeaving && (
          <div className={styles.loading}>
            <LoadingOutlined className={styles['loading-icon']} />
          </div>
        )}
        <LogoutOutlined />
      </Menu.Item>
    </Menu>
  );
}

export default TopMenu;
