import React from 'react';
import styles from './audio.module.css';

// Antd
import { Button } from 'antd';

// Icons
import { CaretRightOutlined } from '@ant-design/icons';

function Audio(props) {
  return (
    <div className={styles['audio-player']}>
      <div className={styles['controls']}>
        <Button icon={<CaretRightOutlined />} type="dashed" shape="circle"></Button>
      </div>
      <div className={styles['icon-container']}>
        <audio src={props.src}></audio>
      </div>
    </div>
  );
}

export default Audio;
