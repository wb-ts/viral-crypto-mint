import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../redux/data/dataActions";
import { connect, callClaim } from "../redux/blockchain/blockchainActions";
import * as s from "../styles/globalStyles";
import styled from "styled-components";
import axios from "axios";


export const StyledButton = styled.button`
  padding: 10px;
  margin: 5px;
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
  border: 4px solid var(--primary);
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
  color: var(--primary);
  text-decoration: none;
`;

const Card = ({ CONFIG: { CONTRACT_ADDRESS, SCAN_LINK, MARKETPLACE, MARKETPLACE_LINK, NETWORK, NFT_NAME, GAS_LIMIT, MEDIA, SYMBOL, MAX_SUPPLY, WEI_COST, DISPLAY_COST }, index, api_key }) => {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [feedback, setFeedback] = useState(`Click Mint below to obtain your Sentinel NFT.`);
    const [mintAmount, setMintAmount] = useState(1);
    const [balanceShiburai, setBalanceShiburai] = useState(0);
    const [minting, setMinting] = useState(false);

    const [mintedCount, setMintedCount] = useState(null);

    const mintNFTs = (nftID, free = false) => {
        let cost;
        if (nftID == 0) {
            cost = WEI_COST;
        }
        let gasLimit = GAS_LIMIT;
        let totalCostWei = free ? 0 : cost * mintAmount;
        if (balanceShiburai > data.shiburaiDiscountAtAmount) totalCostWei / 2;
        let totalGasLimit = String(gasLimit);
        console.log("Cost: ", totalCostWei);
        console.log("Gas limit: ", totalGasLimit);
        setFeedback(`Minting your ${NFT_NAME}...`);
        setMinting(true);
        blockchain.smartContract.methods
            .mintPublic(free ? 1 : mintAmount)
            .send({
                gasLimit: String(totalGasLimit),
                to: CONTRACT_ADDRESS,
                from: blockchain.account,
                value: String(totalCostWei),
            })
            .once("error", (err) => {
                console.log(err);
                setFeedback("Sorry, something went wrong please try again later.");
                setMinting(false);
            })
            .then((receipt) => {
                console.log(receipt);
                setFeedback(
                    `WOW, the ${NFT_NAME} is yours! go visit Opensea.io to view it.`
                );
                setMinting(false);
                dispatch(fetchData(blockchain.account));
                setMintAmount(1);
            });
    };
    const claimNFTs = () => {
        
    }

    const decrementMintAmount = () => {
        let newMintAmount = mintAmount - 1;
        if (newMintAmount < 1) {
            newMintAmount = 1;
        }
        setMintAmount(newMintAmount);
    };

    const incrementMintAmount = () => {
        let newMintAmount = mintAmount + 1;
        if (newMintAmount > 2 && SYMBOL == "Kimono") {
            newMintAmount = 2;
        }
        if (newMintAmount > MAX_SUPPLY - mintedCount) {
            newMintAmount = MAX_SUPPLY - mintedCount;
        }
        setMintAmount(newMintAmount);
    };

    const getData = async () => {

        let res = await axios.get(`https://deep-index.moralis.io/api/v2/nft/${CONTRACT_ADDRESS}`, {
            headers: {
                "Content-type": "application/json",
                "X-API-Key": api_key
            }
        })

        setMintedCount(res.data.total);

        res = await axios.get(`https://deep-index.moralis.io/api/v2/${CONTRACT_ADDRESS}/balance?chain=rinkeby`, {
            headers: {
                "Content-type": "application/json",
                "X-API-Key": api_key
            }
        })

        setBalanceShiburai(res.data.balance);


        // res = await web3.contract.claim(res.data.proof).call();

        // dispatch(callClaim(res.data.proof));

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
                border: "4px solid var(--primary)",
                boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
                maxWidth: "700px",
                margin: "12px"
            }}
        >
            <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg src={`/config/images/${MEDIA}`} alt="" />
            </s.Container>
            <s.SpacerSmall />
            <s.TextTitle
                style={{ textAlign: "center", fontSize: 50, color: "var(--accent-text)" }}
            >
                {SYMBOL}
            </s.TextTitle>
            <s.TextTitle
                style={{
                    textAlign: "center",
                    fontSize: 42,
                    fontWeight: "bold",
                    color: "var(--accent-text)",
                }}
            >
                {mintedCount} / {MAX_SUPPLY}
            </s.TextTitle>
            <s.TextTitle
                style={{ textAlign: "center", color: "var(--accent-text)" }}
            >
                {
                    balanceShiburai > data.shiburaiDiscountAtAmount ?
                        <>{DISPLAY_COST / 2}{" "}{NETWORK.SYMBOL} Each <span style={{ color: "red" }}>50% off</span> </>
                        :
                        `${DISPLAY_COST} ${NETWORK.SYMBOL} Each`
                }
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
                <StyledLink target={"_blank"} href={SCAN_LINK}>
                    {truncate(CONTRACT_ADDRESS, 24)}
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
                >
                    Roadmap
                </StyledButton>
                <StyledButton
                    onClick={(e) => {
                        window.open(MARKETPLACE_LINK, "_blank");
                    }}
                >
                    {MARKETPLACE}
                </StyledButton>
            </span>
            <s.SpacerSmall />
            {Number(mintedCount) >= MAX_SUPPLY ? (
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
                    <StyledLink target={"_blank"} href={MARKETPLACE_LINK}>
                        {MARKETPLACE}
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
                                Connect wallet to obtain Shiburai NFT
                            </s.TextDescription>
                            <s.SpacerSmall />
                            <StyledButton
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch(connect(index));
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
                            {data.reverted ?
                                <>
                                    <s.TextDescription
                                        style={{
                                            textAlign: "center",
                                            color: "var(--accent-text)",
                                        }}
                                    >
                                        You are whitelisted, claim for free here
                                    </s.TextDescription>
                                    <s.SpacerMedium />
                                    <StyledButton
                                        disabled={minting ? 1 : 0}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            claimNFTs(0, true);
                                            getData();
                                        }}
                                    >
                                        {minting ? "BUSY" : "Claim whitelisted"}
                                    </StyledButton>
                                </>
                                : ""
                            }
                            <s.SpacerMedium />
                            <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                <StyledRoundButton
                                    style={{ lineHeight: 0.4 }}
                                    disabled={minting ? 1 : 0}
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
                                    disabled={minting ? 1 : 0}
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
                                    disabled={minting ? 1 : 0}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        mintNFTs(0);
                                        getData();
                                    }}
                                >
                                    {minting ? "BUSY" : "Mint"}
                                </StyledButton>
                                {data.canClaimWithKimono ?
                                    <StyledButton
                                        disabled={minting ? 1 : 0}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            mintNFTs(0, true);
                                            getData();
                                        }}
                                    >
                                        {minting ? "BUSY" : "Free Mint"}
                                    </StyledButton>
                                    : ""
                                }
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