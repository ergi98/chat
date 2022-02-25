import React from 'react';

// ANTD
import { Spin } from 'antd';

function LoadingScreen() {
  return (
    <main className="height-full primary-background center-content">
      <Spin size="large" />
    </main>
  );
}

export default LoadingScreen;
