import React from 'react';
import styles from './glass.module.css';

const GlassDiv = React.forwardRef(({ children, className }, ref) => {
  return (
    <div ref={ref} className={`${className ?? ''} ${styles['glass-div']}`}>
      {children}
    </div>
  );
});

GlassDiv.displayName = 'GlassDiv';

export default GlassDiv;
