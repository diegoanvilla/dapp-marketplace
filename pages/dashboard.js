import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { useBlockChainContext } from "../context/BlockChainContext";
import styles from "../styles/Home.module.scss";
import logo from "../public/1c12.png";
import Loading from "../components/Loading";
import FadeInSection from "../components/isVisible";
export default function CreatorDashboard() {
  const { userContract, provider } = useBlockChainContext();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, [provider]);
  async function loadNFTs() {
    if (!provider) return;
    try {
      console.log(userContract.address);
      const data = await userContract.fetchItemsListed();
      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await userContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          };
          return item;
        })
      );

      setNfts(items);
      setLoadingState("loaded");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className={`${styles.elementContainer} ${styles.minH100}`}>
      <div className={styles.element}>
        <h1 className={`px-20 py-10 text-3xl ${styles.sectionTitle}`}>
          Dashboard{" "}
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
            {!nfts.length || !provider ? (
              <>
                <div className={styles.emptySection}>
                  <div className={styles.logoSection}>
                    <img src={logo.src} />
                  </div>
                  <h1 className={`p-4 py-10 text-3xl `}>
                    No items in Dashboard
                  </h1>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="p-4">
                    {/* <h2 className="text-2xl py-2">Items Listed</h2> */}
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
                              {nft.price} <small>BNB</small>{" "}
                            </h4>
                            <p className={styles.description}>
                              {nft.description}
                            </p>
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
