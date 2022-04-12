import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import Card from "./components/card";
import { fetchData } from "./redux/data/dataActions";
import axios from "axios";

require('dotenv').config();

import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Web3EthContract from 'web3-eth-contract';
import { providerOptions } from "./providerOptions";
import { connect } from "./redux/blockchain/blockchainActions";

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions // required
});

export const StyledLogo = styled.img`
  width: 240px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
  margin-top: 40px;
`;
export const CardGroup = styled.div`
  width: 90%;
  display: flex;
`
export const ResponsiveWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  @media (max-width: 950px) {
    flex-direction: column;
  }
`;
export const Address = styled.div`
  position: absolute;
  top: 12px;
  right: 130px;
  padding: 10px;
  margin: 5px;
  border-radius: 50px;
  border: 4px solid var(--primary);
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  cursor: pointer;
`;
export const StyledButton = styled.button`
  position: absolute;
  right: 15px;
  top: 15px;
  padding: 10px;
  margin: 5px;
  border-radius: 15px;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

function App() {
  const data = useSelector((state) => state["data"]);
  const [CONFIG, SET_CONFIG] = useState([]);
  const blockchain = useSelector((state) => state.blockchain);
  const [countOwnMintedKimonoNFT, setCountOwnMintedKimonoNFT] = useState(0);
  const MORALIS_API_KEY = 'bqFwTY0YKsKkGLPv7GpRm4Q3C6HRXBN2vZIe7NoHi2MQZwt6TlX6qt0WYsmFThLl';
  const shiburaiContractAddress = '0x92697e3aa182a4693Ab65bA3f8225D4f659dE65F';

  //web3modal implement
  const [provider, setProvider] = useState();
  const [library, setLibrary] = useState();
  const [account, setAccount] = useState();
  const [chainId, setChainId] = useState();
  //web3modal implement

  const dispatch = useDispatch();

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const result = await configResponse.json();

    SET_CONFIG(result);
    return result;
  };

  //web3modal implement

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4' }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x4',
                chainName: 'Rinkeby Test Network',
                rpcUrls: ['https://rinkeby.infura.io/v3/'] /* ... */,
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
          console.log(addError);
        }
      }
      // handle other "switch" errors
    }
  };

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      Web3EthContract.setProvider(library.provider);
      setProvider(provider);
      setLibrary(library);
      if(network.chainId != "4") await switchNetwork();
      if (accounts) setAccount(accounts[0]);
      setChainId(network.chainId);
    } catch (error) {
      console.log(error);
    }
  }
  
  const refreshState = () => {
    setAccount();
    setChainId();
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };

  useEffect(async() => {
    await getConfig();
    if (web3Modal.cachedProvider) {
      await connectWallet();
    }
  }, []);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        if (accounts) setAccount(accounts[0]);
      };

      const handleChainChanged = (_hexChainId) => {
        setChainId(_hexChainId);
      };
      const handleDisconnect = () => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  //web3modal implement

  const getData = async () => {
    dispatch(await fetchData(account));
  };

  const getCountKimonoNFTs = async () => {
    const res = await axios.get(`https://deep-index.moralis.io/api/v2/${account}/nft/${CONFIG[0].CONTRACT_ADDRESS}?chain=rinkeby`, {
      headers: {
        "Content-type": "application/json",
        "X-API-Key": MORALIS_API_KEY
      }
    })
    setCountOwnMintedKimonoNFT(res.data.total);
  }
  useEffect(async () => {
    await getConfig();
    if (account) {
      dispatch(await connect(account, MORALIS_API_KEY));
      await getCountKimonoNFTs();
      await getData();
    }
  }, [account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        id="main"
        style={{
          padding: 12,
          backgroundColor: "var(--base)"
        }}
      >
        <s.SpacerSmall />
        {!account ? <StyledButton onClick={()=>{connectWallet()}}> Connect </StyledButton>
        :
        <div style={{

        }}>
          <Address>{account.slice(0,6)}...{account.slice(-3)}</Address>
          <StyledButton style={{ background: "var(--secondary)" }} onClick={()=>{disconnect()}}>Disconnect</StyledButton>
        </div>

        }
        <a href={"/"}>
          <StyledLogo alt={"logo"} id="logo" src={"/config/images/logo.png"} />
        </a>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%", maxWidth: "700px" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: "20px"
            }}
          >
            The Sentinel gives passage into Viral Crypto.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: "20px"
            }}
          >
            Minting and possessing a Sentinel rewards you with VC tokens, gives you access to create a profile on the VC platform, and also reserves an allocation to mint a unique generative avatar that grants benefits on Viral Crypto.
          </s.TextDescription>
          <s.SpacerSmall />
        </s.Container>
        <ResponsiveWrapper flex={1} style={{ padding: 12 }}>
          {
            CONFIG.length && CONFIG.map((item, index) => {
              return <Card key={index}
                account={account}
                CONFIG={item}
                index={index}
                api_key={MORALIS_API_KEY}
                shiburaiContractAddress={shiburaiContractAddress}
                countOwnMintedKimonoNFT={countOwnMintedKimonoNFT}
                getData={getData}
              />
            })
          }
        </ResponsiveWrapper>
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            Please make sure you are connected to the right network (
            RIkeby Test Network ) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            We have set the gas limit to {3000000} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
