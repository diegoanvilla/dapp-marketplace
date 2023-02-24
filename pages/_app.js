import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.scss";
import styles from "../styles/Home.module.scss";
import "../public/particles/css/style.css";
import "../public/particles/css/particles.css";
import { BlockchainContext } from "../context/BlockChainContext";
import { NavbarWrapper } from "../components/Navbar";
import Head from "next/head";
import PageBackground from "../components/PageBackground";
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const app = () => {
      try {
        const script = document.createElement("script");
        script.src = "/particles/js/app.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
          document.body.removeChild(script);
        };
      } catch (err) {
        console.log(err);
      }
    };
    return app();
  }, []);
  return (
    <>
      <Head>
        <title>MARKETPLACE LB</title>
        <meta name="description" content="Marketplace Latam Blockchain" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
          rel="stylesheet"
        ></link>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </Head>
      <div>
        <BlockchainContext>
          <NavbarWrapper>
            <div className={styles.mainSection}>
              <PageBackground />
              <Component {...pageProps} />
            </div>
          </NavbarWrapper>
        </BlockchainContext>
      </div>
    </>
  );
}

export default MyApp;
