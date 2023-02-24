// import React from "react";
// import Link from "next/link";
// import logo from "../public/HorzLogo.png";
// import Image from "next/image";

// import styles from "../styles/Home.module.scss";
// function Navbar() {
//   return (
//     <div>
//       <nav className={`border-b p-6 ${styles.navbar}`}>
//         <Link href="/">
//           <img src={logo.src} className={styles.logoNav} />
//         </Link>

//         <div className={`flex ${styles.linkContainer}`}>
//           <Link href="https://discoper.io/">
//             <a className="mr-4 text-pink-500">Home</a>
//           </Link>
//           <Link href="/create-nft">
//             <a className="mr-6 text-pink-500">Create NFT</a>
//           </Link>
//           <Link href="/my-nfts">
//             <a className="mr-6 text-pink-500">My NFTs</a>
//           </Link>
//           <Link href="/dashboard">
//             <a className="mr-6 text-pink-500">Dashboard</a>
//           </Link>
//           <div className="buttons" onClick={connectWeb3Modal}>
//             <button className={styles.primaryButton}>
//               {account ? account : "Connect Wallet"}
//             </button>
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }

// export default Navbar;
import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Home.module.scss";
import logo from "../public/1c12.png";
// import logoAnim from "../public/ojoAnimado.gif";
import Link from "next/link";
import marketplace from "../public/marketplace.png";
import Router, { useRouter } from "next/router";
import { useBlockChainContext } from "../context/BlockChainContext";
const NavContext = React.createContext();
export default function useNav() {
  return useContext(NavContext);
}
export function NavbarWrapper({ children }) {
  const { account, connectWeb3Modal } = useBlockChainContext();
  const [eyeAnimation, setEyeAnimation] = useState(false);
  const [eye, setEye] = useState(logo.src);
  const router = useRouter();

  return (
    <>
      <div className={`${styles.navbar} ${styles.navLight}`}>
        <div className={`${styles.navSection} links`}>
          <Link href="https://web-dapp-profile.vercel.app/">
            <a>
              <span className="material-symbols-outlined">home</span>
              Home
            </a>
          </Link>
          <Link href="/create-nft">
            <a>
              <span className="material-symbols-outlined">add_circle</span>
              Crear NFT
            </a>
          </Link>
          <Link href="/my-nfts">
            <a>
              <span className="material-symbols-outlined">widgets</span>
              Mis NFTs
            </a>
          </Link>
          <Link href="/dashboard">
            <a>
              <span className="material-symbols-outlined">space_dashboard</span>
              Tablero
            </a>
          </Link>
        </div>
        <div className={styles.logoNav} onClick={() => Router.push("/")}>
          <img src={eye} alt="logo" srcSet="" />
        </div>

        <div className={`${styles.buttons}`} onClick={connectWeb3Modal}>
          <button
            className={styles.primaryButton}
            style={{ maxWidth: account ? "auto" : "200px" }}
          >
            {account ? account : "Connect Wallet"}
          </button>
        </div>
      </div>
      <NavContext.Provider value={{ setEyeAnimation, eyeAnimation }}>
        {children}
      </NavContext.Provider>
    </>
  );
}
