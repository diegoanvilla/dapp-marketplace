import { useState, useRef, useEffect } from "react";
import styles from "../styles/Home.module.scss";

const FadeInSection = ({ children, className, key }) => {
  const domRef = useRef();

  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    let previousY = 0;
    let previousRatio = 0;
    const observer = new IntersectionObserver(
      ([entries]) => {
        if (entries.isIntersecting) {
          // Not possible to set it back to false like this:
          setVisible(true);
          // No need to keep observing:
          return observer.unobserve(domRef.current);
        }
      },
      {
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    observer.observe(domRef.current);

    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      key={key}
      className={`${isVisible ? styles.fadeIn : styles.fade} ${className}`}
      style={{ transition: "margin 700ms" }}
    >
      {children}
    </div>
  );
};

export default FadeInSection;
