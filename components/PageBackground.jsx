import React from "react";
import Particles from "./Particles";
import styles from "../styles/Home.module.scss";
function PageBackground() {
  return (
    <div className={styles.particlesGeneralBg}>
      <Particles />
    </div>
  );
}

export default PageBackground;
