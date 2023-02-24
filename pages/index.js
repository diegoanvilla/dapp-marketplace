import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { useBlockChainContext } from "../context/BlockChainContext";
import styles from "../styles/Home.module.scss";
import logo from "../public/1c12.png";
import Loading from "../components/Loading";
import Link from "next/link";
import FadeInSection from "../components/isVisible";
export default function Home() {
  const {
    contract,
    userContract,
    provider,
    setMessage,
    account,
    connectWeb3Modal,
  } = useBlockChainContext();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, [provider]);
  async function loadNFTs() {
    // if (!provider) return;
    try {
      /* create a generic provider and query for unsold market items */
      console.log(contract);

      const data = await contract.fetchMarketItems();
      console.log("xd");
      /*
       *  map over items returned from smart contract and format
       *  them as well as fetch their token metadata
       */
      const items = await Promise.all(
        data.map(async (i) => {
          console.log(i);
          const tokenUri = await contract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          console.log(meta);
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
      setMessage(
        "Algo salio mal revisa que estes conectado en la red de binance"
      );
      setLoadingState("loaded");
    }
  }
  async function buyNft(nft) {
    try {
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      const transaction = await userContract.createMarketSale(nft.tokenId, {
        value: price,
      });
      await transaction.wait();
      setMessage("Transaccion Finalizada");
      loadNFTs();
    } catch (err) {
      console.log(err);
      setMessage(
        "Algo salio mal revisa que estes conectado en la red de binance"
      );
    }
  }
  return (
    <>
      <div className={styles.jumbotron}>
        <FadeInSection className={styles.jumbotronTitleSection}>
          <h1>Checkea Nuevos NFT&apos;s</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec
            luctus purus.
          </p>
          <div className={styles.buttons}>
            <button className={styles.primaryButton} onClick={connectWeb3Modal}>
              {account ? account : "Connect Wallet"}
            </button>
            <Link href="/create-nft">
              <button className={styles.secondaryButton}>
                Crea NFT&apos;s
              </button>
            </Link>
          </div>
        </FadeInSection>
        <FadeInSection className="new-nft-jumbotron-section">
          <div
            className={`border shadow rounded-xl overflow-hidden ${styles.nft}`}
          >
            {nfts.length ? (
              <>
                <div className={styles.nftImageWrapperJumboSection}>
                  <img src={nfts[nfts.length - 1].image} />
                </div>
                <div className={styles.titleNDesc}>
                  <h1>{nfts[nfts.length - 1].name}</h1>
                  <h4>
                    {nfts[nfts.length - 1].price} <small>BNB</small>
                  </h4>
                  <p className={styles.description}>
                    {nfts[nfts.length - 1].description}
                  </p>
                </div>
              </>
            ) : (
              <Loading />
            )}
          </div>
        </FadeInSection>
      </div>
      <div className={styles.elementContainer}>
        <div className={`flex justify-center ${styles.element}`}>
          <h1 className={`px-20 py-10 text-3xl ${styles.sectionTitle}`}>
            Marketplace{" "}
            <span
              className={`material-symbols-outlined ${styles.biggerSymbol}`}
            >
              store
            </span>
          </h1>
          {loadingState === "not-loaded" ? (
            <div className={styles.emptySection}>
              <Loading />
            </div>
          ) : (
            <>
              {nfts.length === 0 ? (
                <>
                  <div className={styles.emptySection}>
                    <div className={styles.logoSection}>
                      <img src={logo.src} />
                    </div>
                    <h1 className={`p-4 py-10 text-3xl `}>
                      No items in marketplace
                    </h1>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ maxWidth: "1600px" }}>
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
                              onClick={() => buyNft(nft)}
                              className={styles.primaryButton}
                            >
                              Buy
                            </button>
                          </div>
                        </FadeInSection>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
