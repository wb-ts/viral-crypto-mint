import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import Card from "./components/card";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import axios from "axios";

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
  right: 15px;
  top: 15px;
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
  const connectWallet = () => {
    dispatch(connect(MORALIS_API_KEY));
  }

  const getData = async () => {
    dispatch(await fetchData(blockchain.account));
  };

  const getCountKimonoNFTs = async () => {
    const res = await axios.get(`https://deep-index.moralis.io/api/v2/${blockchain.account}/nft/${CONFIG[0].CONTRACT_ADDRESS}?chain=rinkeby`, {
      headers: {
        "Content-type": "application/json",
        "X-API-Key": MORALIS_API_KEY
      }
    })
    setCountOwnMintedKimonoNFT(res.data.total);
  }
  useEffect(()=> {
    getConfig();
  })
  useEffect(async () => {
    if (blockchain.account) {
      await getCountKimonoNFTs();
      await getData();
    }
  }, [blockchain.account]);

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
        {!blockchain.account ? <StyledButton onClick={connectWallet}> Connect </StyledButton>
        :
        <Address>{blockchain.account.slice(0,6)}...{blockchain.account.slice(-3)}</Address>
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
