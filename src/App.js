import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import Card from "./components/card";


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

function App() {

  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0
    },
    NFT_NAME: "",
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    GAS_LIMIT: 0,
    SHOW_BACKGROUND: false
  });
  
  const [items, setItems] = useState([]);
  const data = useSelector((state) => state.data);

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const result = await configResponse.json();
    SET_CONFIG(result.CONFIG);
    setItems(result.ITEMS);
  };
  
  useEffect(() => {
    getConfig();
  }, []);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 12, backgroundColor: "var(--base)" }}
      >
        <s.SpacerSmall />
        <s.SpacerSmall />
        <s.SpacerSmall />
        <a href={CONFIG.MARKETPLACE_LINK}>
          <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
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
        {
          items.length ? 
          <ResponsiveWrapper flex={1} style={{ padding: 12 }}>
            <Card CONFIG={CONFIG} ItemOption={items[0]} />
            <Card CONFIG={CONFIG} ItemOption={items[1]} />
            <Card CONFIG={CONFIG} ItemOption={items[2]} />  
          </ResponsiveWrapper>
          : ""
          
        }
        
        
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
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
