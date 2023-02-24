import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import { useBlockChainContext } from "../context/BlockChainContext";
import styles from "../styles/Home.module.scss";
import Image from "next/image";
import Loading from "../components/Loading";
const projectId = "2DjAjMKoRrQrwcaYrttzqrJY8dO";
const projectSecret = "c42e2f89d4d01f42366a7470f3dbe5a2";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default function CreateItem() {
  const { userContract, contract, provider, setMessage } =
    useBlockChainContext();
  const allInputs = { imgUrl: "" };
  const fileInputField = useRef(null);
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);
  const [fileUrl, setFileUrl] = useState(null);
  const [dropHere, setDropHere] = useState(false);

  const [loading, setLoading] = useState(false);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  const handleUploadBtnClick = () => {
    fileInputField.current.click();
  };

  async function onChange(e) {
    const file = e.target.files[0];
    setLoading(true);
    try {
      if (e.target.files && e.target.files[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
          setImageAsUrl({ imgUrl: e.target.result });
          console.log(imageAsUrl);
        };
        reader.readAsDataURL(e.target.files[0]);
      }
      const image = e.target.files[0];
      setImageAsFile((imageFile) => image);
      // const added = await client.add(file, {
      //   progress: (prog) => console.log(`received: ${prog}`),
      // });
      // console.log(added);
      // const url = `https://nff-lb.infura-ipfs.io/ipfs/${added.path}`;
      // setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
    setLoading(false);
  }
  async function uploadToIPFS() {
    setLoading(true);
    const { name, description, price } = formInput;
    if (!name || !description || !price || !imageAsUrl.imgUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: imageAsUrl.imgUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://nff-lb.infura-ipfs.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
    setLoading(false);
  }

  async function listNFTForSale() {
    setLoading(true);
    try {
      if (!provider) {
        setMessage("Por favor conecta tu wallet para crear un NFT");
        return setLoading(false);
      }
      const url = await uploadToIPFS();
      /* next, create the item */
      const price = ethers.utils.parseUnits(formInput.price, "ether");
      let listingPrice = await userContract.getListingPrice();
      listingPrice = listingPrice.toString();
      let transaction = await userContract.createToken(url, price, {
        value: listingPrice,
      });
      console.log(transaction);
      await transaction.wait();
      setMessage("Transaccion Finalizada");
      router.push("/");
    } catch (err) {
      setMessage(
        "Algo salio mal, revisa que tengas suficiente balance para hacer la transaccion"
      );
      console.log(err);
    }
    setLoading(false);
  }

  const showDrop = () => {
    setDropHere(true);
  };
  const hideDrop = () => {
    setDropHere(false);
  };

  useEffect(() => {
    window.addEventListener("dragenter", showDrop);
    window.addEventListener("dragover", showDrop);
    window.addEventListener("drop", hideDrop);
    window.addEventListener("dragleave", hideDrop);
    return () => {
      window.removeEventListener("dragenter", showDrop);
      window.removeEventListener("dragover", showDrop);
      window.removeEventListener("drop", hideDrop);
      window.removeEventListener("dragleave", hideDrop);
    };
  }, []);

  return (
    <div className={`${styles.elementContainer} ${styles.minH100}`}>
      <div className={`${styles.element} ${styles.formContainer}`}>
        {loading && <Loading />}
        <h1 className={`px-20 py-10 text-3xl ${styles.sectionTitle}`}>
          Create NFT{" "}
          <span className={`material-symbols-outlined ${styles.biggerSymbol}`}>
            edit
          </span>
        </h1>
        <div className={styles.form}>
          {dropHere && (
            <div className={styles.dropHere}>
              <h3>Drop Your Image Here</h3>
            </div>
          )}
          <input
            placeholder="Asset Name"
            className="mt-8 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          <textarea
            placeholder="Asset Description"
            className="mt-2 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
          <input
            placeholder="Asset Price in BNB"
            className="mt-2 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, price: e.target.value })
            }
          />
          {imageAsUrl.imgUrl && (
            <img
              className={`${styles.createNftImage} rounded mt-4`}
              src={imageAsUrl.imgUrl}
            />
          )}
          <input
            className={styles.inputFile}
            type="file"
            style={{ pointerEvents: dropHere ? "all" : "none" }}
            ref={fileInputField}
            onChange={onChange}
            title=""
            value=""
          />
          <div className={styles.inputFileSection}>
            <p className={styles.m0}>Arrastra tu imagen aca o</p>
            <button
              type="button"
              className={styles.thirdButton}
              onClick={() => handleUploadBtnClick()}
            >
              <span>Sube una imagen</span>
            </button>
          </div>
          <button onClick={listNFTForSale} className={styles.primaryButton}>
            Create NFT
          </button>
        </div>
      </div>
    </div>
  );
}
