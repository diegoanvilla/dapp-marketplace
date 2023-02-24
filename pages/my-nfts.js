import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useBlockChainContext } from "../context/BlockChainContext";
import styles from "../styles/Home.module.scss";
import logo from "../public/1c12.png";
import Image from "next/image";
import Loading from "../components/Loading";
import FadeInSection from "../components/isVisible";

export default function MyAssets() {
  const { userContract, provider, setMessage } = useBlockChainContext();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();
  useEffect(() => {
    loadNFTs();
  }, [provider]);

  async function loadNFTs() {
    if (!provider) return;
    try {
      const data = await userContract
        .connect(await provider.getSigner())
        .fetchMyNFTs();
      console.log(data);

      const items = await Promise.all(
        data.map(async (i) => {
          const tokenURI = await userContract.tokenURI(i.tokenId);
          console.log(tokenURI);
          const meta = await axios.get(tokenURI);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            tokenURI,
            name: meta.data.name,
            description: meta.data.description,
          };
          return item;
        })
      );
      setNfts(items);
      setLoadingState("loaded");
    } catch (err) {
      setMessage("Algo salio mal");
      console.log(err);
    }
  }
  function listNFT(nft) {
    console.log("nft:", nft);
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }
  return (
    <div className={`${styles.elementContainer} ${styles.minH100}`}>
      <div className={styles.element}>
        <h1 className={`px-20 py-10 text-3xl ${styles.sectionTitle}`}>
          My NFTs{" "}
          <span className={`material-symbols-outlined ${styles.biggerSymbol}`}>
            dashboard
          </span>
        </h1>
        {loadingState === "not-loaded" && userContract ? (
          <div className={styles.emptySection}>
            <Loading />
          </div>
        ) : (
          <>
            {(loadingState === "loaded" && !nfts.length) || !provider ? (
              <>
                <div className={styles.emptySection}>
                  <div className={styles.logoSection}>
                    <img src={logo.src} />
                  </div>
                  <h1 className={`p-4 py-10 text-3xl `}>No items in My NFTs</h1>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="p-4">
                    <div className={styles.nftGrid}>
                      {nfts.map((nft, i) => (
                        <FadeInSection
                          key={i}
                          className={`border shadow rounded-xl overflow-hidden ${styles.nft}`}
                        >
                          <div className={styles.nftImageWrapper}>
                            <img src={nft.image} />
                          </div>
                          <div className={styles.titleNDesc}>
                            <h1>{nft.name}</h1>
                            <h4>
                              {nft.price} <small>BNB</small>
                            </h4>
                            <p className={styles.description}>
                              {nft.description}
                            </p>
                            <button
                              onClick={() => listNFT(nft)}
                              className={styles.primaryButton}
                            >
                              List
                            </button>
                          </div>
                        </FadeInSection>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
