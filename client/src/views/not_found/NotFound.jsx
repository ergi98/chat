import React from 'react';
import styles from './not-found.module.css';

// Antd
import { Button } from 'antd';

// SVG
import NotFoundSVG from '../../assets/svg/not-found.svg';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  function goToHome() {
    navigate('/', { replace: true });
  }

  return (
    <div className="height-full center-content primary-background">
      <NotFoundSVG className={styles.svg} />
      <h1 className={`${styles['not-found-title']} title`}>Whoops ...</h1>
      <span className="secondary-text">
        The page you are trying to reach does not exist. Are you lost?
      </span>
      <Button onClick={goToHome} className={styles.button} type="primary">
        Send me Home
      </Button>
    </div>
  );
}

export default NotFound;
