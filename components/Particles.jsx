import React, { useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
function Particles({ id, color }) {
  useEffect(() => {
    const app = () => {
      try {
        if (!window.particlesJS) return;
        window.particlesJS(id ? id : "particles-js", {
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: color ? color : "#FFF",
            },
            shape: {
              type: "circle",
              stroke: {
                width: 0,
                color: color ? color : "#000000",
              },
              polygon: {
                nb_sides: 5,
              },
              image: {
                src: "img/github.svg",
                width: 100,
                height: 100,
              },
            },
            opacity: {
              value: 0.2,
              random: false,
              anim: {
                enable: false,
                speed: 0.5,
                opacity_min: 0.1,
                sync: false,
              },
            },
            size: {
              value: 4,
              random: true,
              anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false,
              },
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: color ? color : "#FFF",
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: false,
                mode: "repulse",
              },
              onclick: {
                enable: false,
                mode: "push",
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 400,
                line_linked: {
                  opacity: 1,
                },
              },
              bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3,
              },
              repulse: {
                distance: 200,
              },
              push: {
                particles_nb: 4,
              },
              remove: {
                particles_nb: 2,
              },
            },
          },
          retina_detect: true,
          config_demo: {
            hide_card: false,
          },
        });
      } catch (err) {
        console.log(err);
      }
    };
    return app();
  }, []);

  return (
    <>
      <div id={id ? id : `particles-js`} className={styles.particles}></div>
    </>
  );
}

export default Particles;
