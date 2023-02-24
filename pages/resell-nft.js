import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import { useBlockChainContext } from "../context/BlockChainContext";
import styles from "../styles/Home.module.scss";
import Loading from "../components/Loading";
import Image from "next/image";

export default function ResellNFT() {
  const { userContract, provider, setMessage } = useBlockChainContext();
  const [formInput, updateFormInput] = useState({ price: "", image: "" });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { id, tokenURI } = router.query;
  const { image, price } = formInput;

  useEffect(() => {
    fetchNFT();
  }, [id, provider]);

  async function fetchNFT() {
    if (!tokenURI) return;
    const meta = await axios.get(tokenURI);
    updateFormInput((state) => ({ ...state, image: meta.data.image }));
  }

  async function listNFTForSale() {
    if (!provider) return;
    setLoading(true);
    try {
      if (!price) return;

      const priceFormatted = ethers.utils.parseUnits(formInput.price, "ether");

      let listingPrice = await userContract.getListingPrice();

      listingPrice = listingPrice.toString();
      let transaction = await userContract.resellToken(id, priceFormatted, {
        value: listingPrice,
      });
      await transaction.wait();

      router.push("/");
    } catch (err) {
      setLoading(false);
      setMessage("Algo salio mal");
      console.log(err);
    }
  }

  return (
    <div className={`${styles.elementContainer} ${styles.minH100}`}>
      <div className={`${styles.element} ${styles.formContainer}`}>
        {loading && <Loading />}

        <h1 className={`px-20 py-10 text-3xl ${styles.sectionTitle}`}>
          Resell NFT{" "}
          <span className={`material-symbols-outlined ${styles.biggerSymbol}`}>
            sell
          </span>
        </h1>
        <div className={styles.form}>
          <input
            placeholder="Asset Price in Eth"
            className="mt-2 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, price: e.target.value })
            }
          />
          {image && (
            <img
              className={`${styles.createNftImage} rounded mt-4`}
              src={image}
            />
          )}
          <button
            onClick={() => listNFTForSale()}
            className={styles.primaryButton}
          >
            List NFT
          </button>
        </div>
      </div>
    </div>
  );
}
