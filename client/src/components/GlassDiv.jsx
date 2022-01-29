import React from "react";
import styles from "./glass.module.css";

function GlassDiv({ children, className }) {
  return (
    <div className={`${className ?? ""} ${styles["glass-div"]}`}>
      {children}
    </div>
  );
}

export default GlassDiv;
