import React, { useContext, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers, providers } from "ethers";
import { marketplaceAddress } from "../config";
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import styles from "../styles/Home.module.scss";
import Loading from "../components/Loading";
const BCContext = React.createContext();

export function useBlockChainContext() {
  return useContext(BCContext);
}

export function BlockchainContext({ children }) {
  //Setting Variables
  const [account, setAccount] = useState();
  const [instance, setInstance] = useState();
  const [provider, setProvider] = useState();
  const [message, setMessage] = useState();
  const [userContract, setUserContract] = useState();
  const [networkMatch, setNetworkMatch] = useState(true);
  const [contract, setContract] = useState();
  const [loading, setLoading] = useState(false);
  //Set user in web3Modal
  const providerOptions = {
    metamask: {
      id: "injected",
      name: "MetaMask",
      type: "injected",
      check: "isMetaMask",
    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "04bfa7d48b3e4d0e87bf5c8c7e15b4c3", // Required
        qrcodeModalOptions: {
          mobileLinks: [
            "rainbow",
            "metamask",
            "argent",
            "trust",
            "imtoken",
            "pillar",
          ],
        },
      },
    },
    theme: "dark",
  };

  //Connect to user's wallet
  const connectWeb3Modal = async () => {
    try {
      const web3Modal = new Web3Modal({
        providerOptions,
      });
      web3Modal.clearCachedProvider();
      const instance = await web3Modal.connect();
      const provider = await new ethers.providers.Web3Provider(instance);
      const contract = await new ethers.Contract(
        marketplaceAddress,
        NFTMarketplace.abi,
        await provider.getSigner()
      );
      setUserContract(await contract.connect(await provider.getSigner()));
      setInstance(instance);
      setProvider(provider);
      setAccount(await provider.getSigner().getAddress());
    } catch (err) {
      setMessage("Por favor conecta tu wallet");
      console.log(err);
    }
  };

  //Update user's metamask network
  const updateNet = (id) => {
    console.log(id, id != "97");
    if (id != "97") {
      setMessage("Red Equivocada Conectate a la red de Binance");
      setNetworkMatch(false);
      throw "Unknown Network";
    }
    setNetworkMatch(true);
  };

  const checkForWeb3 = () => {
    if (!provider) {
      setMessage("Please connect a wallet");
      return false;
    }
    return true;
  };
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const defaultProvider = new ethers.providers.JsonRpcProvider(
        "https://data-seed-prebsc-1-s1.binance.org:8545/"
      );
      const contract = await new ethers.Contract(
        marketplaceAddress,
        NFTMarketplace.abi,
        defaultProvider
      );
      setContract(contract);
      setLoading(false);
      if (instance) {
        //When User Changes Accounts
        instance.on("accountsChanged", async (account) => {
          if (account.length == 0) {
            setAccount("");
            return setMessage("Please connect your wallet");
          }
          const newProvider = await new providers.Web3Provider(instance);
          setAccount(await newProvider.getSigner().getAddress());
          setProvider(newProvider);
        });

        //When User Changes Chain
        instance.on("chainChanged", async (chainId) => {
          try {
            setProvider(await new ethers.providers.Web3Provider(instance));
            updateNet(parseInt(Number(chainId)));
          } catch (err) {
            console.log(err);
          }
        });
        updateNet(
          await (
            await new providers.Web3Provider(instance).getNetwork()
          ).chainId
        );
      }
    };
    init();
  }, [instance]);
  return (
    <BCContext.Provider
      value={{
        connectWeb3Modal,
        provider,
        account,
        updateNet,
        setMessage,
        checkForWeb3,
        userContract,
        contract,
      }}
    >
      {!networkMatch && account && <ConnectToBinance />}
      {contract ? children : <Loading />}
      {message && <Modal message={message} setMessage={setMessage} />}
    </BCContext.Provider>
  );
}

const Modal = ({ message, setMessage }) => {
  const [animation, setAnimation] = useState(false);
  const goBack = () => {
    setTimeout(() => {
      setMessage("");
    }, 400);
  };
  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setAnimation(true);
        goBack();
      }, 3000);
    }
  }, [message]);

  return (
    <>
      <div
        key={message}
        className={`${styles.modal} ${animation ? styles.goBack : styles.goIn}`}
      >
        {message}
      </div>
    </>
  );
};

const ConnectToBinance = () => {
  return (
    <>
      <div className={`${styles.connectBinance} ${styles.textCenter}`}>
        <div>
          <h1>Por Favor utiliza la red Binance Smart Chain</h1>
          <div className={styles.networkInfo}>
            <div className={styles.networkInfoSection}>
              <h4>Nombre de Red:</h4>
              <h4>Smart Chain - Testnet</h4>
            </div>
            <div className={styles.networkInfoSection}>
              <h4>RPC URL:</h4>
              <h4>https://data-seed-prebsc-1-s1.binance.org:8545/</h4>
            </div>
            <div className={styles.networkInfoSection}>
              <h4>Chain ID:</h4>
              <h4>97</h4>
            </div>
            <div className={styles.networkInfoSection}>
              <h4>Simbolo:</h4>
              <h4>BNB</h4>
            </div>
            <div className={styles.networkInfoSection}>
              <h4>Explorador de Bloques URL:</h4>
              <h4>https://testnet.bscscan.com</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
