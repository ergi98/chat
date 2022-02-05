import React, { useEffect, useState } from 'react';
import styles from './options.module.css';

// ANTD
import { Radio, Modal, Button, Space } from 'antd';

// Utilities
import { getSelectedTheme, setAppTheme } from '../utilities/theme.utilities';

// Icons
import { CloseOutlined } from '@ant-design/icons';

function Options({ isVisible, close }) {
  const [selectedTheme, setSelectedTheme] = useState('');

  function onThemeChange(event) {
    let mode = event.target.value;
    console.log(mode);
    setAppTheme(mode);
    setSelectedTheme(mode);
  }

  useEffect(() => {
    let storedTheme = getSelectedTheme();
    setSelectedTheme(storedTheme);
  }, []);

  return (
    <Modal
      title={
        <div className={styles['modal-header']}>
          <div className={styles['header-content']}>
            <div>Chat Options</div>
            <Button
              onClick={() => close()}
              icon={<CloseOutlined className={styles['close-icon']} />}
              shape="circle"
              type="text"
            />
          </div>
          <hr className={styles.divider} />
        </div>
      }
      footer={null}
      closable={false}
      maskClosable={true}
      visible={isVisible}
      autoFocusButton={null}
      bodyStyle={{
        background: 'var(--dark-bg)'
      }}
      maskStyle={{
        background: 'var(--overlay)'
      }}
      onCancel={() => close()}
      destroyOnClose={true}>
      <div className={styles.menu}>
        <div className={styles['text']}>Application Theme</div>
        <Radio.Group
          size="large"
          className={styles.radio}
          onChange={onThemeChange}
          value={selectedTheme}>
          <Space size={14} direction="vertical">
            <Radio className={styles['radio-value']} value={'light'}>
              Light Mode
            </Radio>
            <Radio className={styles['radio-value']} value={'dark'}>
              Dark Mode
            </Radio>
            <Radio className={styles['radio-value']} value={'device'}>
              Use Device Theme
            </Radio>
          </Space>
        </Radio.Group>
      </div>
    </Modal>
  );
}

export default Options;
