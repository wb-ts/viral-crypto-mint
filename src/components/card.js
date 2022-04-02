import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../redux/data/dataActions";
import { connect } from "../redux/blockchain/blockchainActions";
import * as s from "../styles/globalStyles";
import styled from "styled-components";


export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
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

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px solid var(--secondary);
  background-color: var(--accent);
  border-radius: none;
  width: 360px;
  @media (max-width: 600px) {
      width: 90%;
  }
  @media (min-width: 950px) {
    width: 220px;
  }
  @media (min-width: 1200px) {
    width: 280px;
  }
  @media (min-width: 1500px) {
    width: 360px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

const Card = ({CONFIG : { NETWORK , NFT_NAME , GAS_LIMIT } , ItemOption }) => {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    
    const [feedback, setFeedback] = useState(`Click Mint below to obtain your Sentinel NFT.`);
    const [mintAmount, setMintAmount] = useState(1);
    const [claimingNft, setClaimingNft] = useState(false);

    const claimNFTs = (nftID) => {
        let cost;
        if (nftID == 0) {
            cost = ItemOption.WEI_COST;
        }
        let gasLimit = GAS_LIMIT;
        let totalCostWei = String(cost);
        let totalGasLimit = String(gasLimit);
        console.log("Cost: ", totalCostWei);
        console.log("Gas limit: ", totalGasLimit);
        setFeedback(`Minting your ${NFT_NAME}...`);
        setClaimingNft(true);
        blockchain.smartContract.methods
            .mint([])
            .send({
                gasLimit: String(totalGasLimit),
                to:  ItemOption.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: totalCostWei,
            })
            .once("error", (err) => {
                console.log(err);
                setFeedback("Sorry, something went wrong please try again later.");
                setClaimingNft(false);
            })
            .then((receipt) => {
                console.log(receipt);
                setFeedback(
                    `WOW, the ${NFT_NAME} is yours! go visit Opensea.io to view it.`
                );
                setClaimingNft(false);
                dispatch(fetchData(blockchain.account));
                setMintAmount(1);
            });


    };

    const decrementMintAmount = () => {
        let newMintAmount = mintAmount - 1;
        if (newMintAmount < 1) {
            newMintAmount = 1;
        }
        setMintAmount(newMintAmount);
    };

    const incrementMintAmount = () => {
        let newMintAmount = mintAmount + 1;
        if (newMintAmount > 3) {
            newMintAmount = 3;
        }
        setMintAmount(newMintAmount);
    };

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };
    useEffect(() => {
        getData();
    }, [blockchain.account]);


    const truncate = (input, len) => input.length > len ? `${input.substring(0, len)}...` : input;

    return (

        <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
                backgroundColor: "var(--accent)",
                padding: 24,
                borderRadius: 24,
                border: "4px solid var(--secondary)",
                boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
                maxWidth: "700px",
                margin: "12px"
            }}
        >
            <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg alt={"example"} src={`/config/images/${ItemOption.IMAGE}`} />
            </s.Container>
            <s.SpacerSmall />
            <s.TextTitle
                style={{ textAlign: "center", fontSize: 50, color: "var(--accent-text)" }}
            >
                {ItemOption.SYMBOL}
            </s.TextTitle>
            <s.TextTitle
                style={{
                    textAlign: "center",
                    fontSize: 42,
                    fontWeight: "bold",
                    color: "var(--accent-text)",
                }}
            >
                {ItemOption.mintedCount} / {ItemOption.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextTitle
                style={{ textAlign: "center", color: "var(--accent-text)" }}
            >
                {ItemOption.DISPLAY_COST}{" "}
                {NETWORK.SYMBOL}{" "}Each
            </s.TextTitle>
            <s.TextDescription
                style={{ textAlign: "center", color: "var(--accent-text)" }}
            >
                Excluding gas fees.
            </s.TextDescription>
            <s.TextDescription
                style={{
                    textAlign: "center",
                    color: "var(--primary-text)",
                }}
            >
                <StyledLink target={"_blank"} href={ ItemOption.SCAN_LINK}>
                    {truncate( ItemOption.CONTRACT_ADDRESS, 24)}
                </StyledLink>
            </s.TextDescription>
            <span
                style={{
                    textAlign: "center",
                }}
            >
                <StyledButton
                    onClick={(e) => {
                        window.open("/config/roadmap.pdf", "_blank");
                    }}
                    style={{
                        margin: "5px",
                    }}
                >
                    Roadmap
                </StyledButton>
                <StyledButton
                    style={{
                        margin: "5px",
                    }}
                    onClick={(e) => {
                        window.open(ItemOption.MARKETPLACE_LINK, "_blank");
                    }}
                >
                    {ItemOption.MARKETPLACE}
                </StyledButton>
            </span>
            <s.SpacerSmall />
            {Number(ItemOption.mintedCount) >= ItemOption.MAX_SUPPLY ? (
                <>
                    <s.TextTitle
                        style={{ textAlign: "center", color: "var(--accent-text)" }}
                    >
                        The sale has ended.
                    </s.TextTitle>
                    <s.TextDescription
                        style={{ textAlign: "center", color: "var(--accent-text)" }}
                    >
                        You can still find {NFT_NAME} on
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledLink target={"_blank"} href={ItemOption.MARKETPLACE_LINK}>
                        {ItemOption.MARKETPLACE}
                    </StyledLink>
                </>
            ) : (
                <>
                    <s.SpacerSmall />
                    {blockchain.account === "" ||
                        blockchain.smartContract === null ? (
                        <s.Container ai={"center"} jc={"center"}>
                            <s.TextDescription
                                style={{
                                    textAlign: "center",
                                    color: "var(--accent-text)",
                                }}
                            >
                                Connect to {NETWORK.NAME} for Minted Supply and<br /> obtain The Sentinel
                            </s.TextDescription>
                            <s.SpacerSmall />
                            <StyledButton
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch(connect());
                                    getData();
                                }}
                            >
                                CONNECT
                            </StyledButton>
                            {blockchain.errorMsg !== "" ? (
                                <>
                                    <s.SpacerSmall />
                                    <s.TextDescription
                                        style={{
                                            textAlign: "center",
                                            color: "var(--accent-text)",
                                        }}
                                    >
                                        {blockchain.errorMsg}
                                    </s.TextDescription>
                                </>
                            ) : null}
                        </s.Container>
                    ) : (
                        <>
                            <s.TextDescription
                                style={{
                                    textAlign: "center",
                                    color: "var(--accent-text)",
                                }}
                            >
                                {feedback}
                            </s.TextDescription>
                            <s.SpacerMedium />
                            <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                <StyledRoundButton
                                    style={{ lineHeight: 0.4 }}
                                    disabled={claimingNft ? 1 : 0}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        decrementMintAmount();
                                    }}
                                >
                                    -
                                </StyledRoundButton>
                                <s.SpacerMedium />
                                <s.TextDescription
                                    style={{
                                        textAlign: "center",
                                        color: "var(--accent-text)",
                                    }}
                                >
                                    {mintAmount}
                                </s.TextDescription>
                                <s.SpacerMedium />
                                <StyledRoundButton
                                    disabled={claimingNft ? 1 : 0}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        incrementMintAmount();
                                    }}
                                >
                                    +
                                </StyledRoundButton>
                            </s.Container>
                            <s.SpacerMedium />
                            <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                <StyledButton
                                    disabled={claimingNft ? 1 : 0}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        claimNFTs(0);
                                        getData();
                                    }}
                                >
                                    {claimingNft ? "BUSY" : "Mint"}
                                </StyledButton>
                            </s.Container>
                        </>
                    )}
                </>
            )}
            <s.SpacerMedium />
        </s.Container>


    );
}

export default Card;