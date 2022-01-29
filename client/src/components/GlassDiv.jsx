import React from "react";
import styles from "./glass.module.css";

function GlassDiv({ children }) {
  return <div className={styles["glass-div"]}>{children}</div>;
}

export default GlassDiv;
