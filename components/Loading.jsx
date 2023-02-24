import React from "react";
import styles from "../styles/Home.module.scss";
function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.ldsRipple}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loading;
