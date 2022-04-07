// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
import axios from "axios";
// log
import { fetchData , fetchDataSuccessInBlockchain } from "../data/dataActions";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};


export const switchNetwork = async () => {
  const { ethereum } = window;
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x4' }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
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
      }
    }
    // handle other "switch" errors
  }
}

export const connect = (index, api_key) => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const CONFIG = await configResponse.json();
    const abiResponse = await fetch(`/config/${CONFIG[index].SYMBOL}_abi.json`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();

    const { ethereum } = window;

    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
      Web3EthContract.setProvider(ethereum);
      let web3 = new Web3(ethereum);
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        let networkId = await ethereum.request({
          method: "net_version",
        });

        if (networkId != CONFIG[index].NETWORK.ID) await switchNetwork();

        const SmartContractObj = new Web3EthContract(
          abi,
          CONFIG[index].CONTRACT_ADDRESS
        );
        switch (CONFIG[index].SYMBOL) {
          case "Kimono":
            dispatch(
              connectSuccess({
                account: accounts[0],
                smartContract_Kimono: SmartContractObj,
                web3: web3,
              })
            );
            break;
          case "Katana":
            dispatch(
              connectSuccess({
                account: accounts[0],
                smartContract_Katana: SmartContractObj,
                web3: web3,
              })
            );
            break;
          case "Kabuto":
            dispatch(
              connectSuccess({
                account: accounts[0],
                smartContract_Kabuto: SmartContractObj,
                web3: web3,
              })
            );
            break;
          default:
            break;
        }

        // Getting Owned Kimino NFTs

        const res = await axios.get(`https://deep-index.moralis.io/api/v2/${accounts[0]}/nft?chain=rinkeby`, {
          headers: {
              "Content-type": "application/json",
              "X-API-Key": api_key
          }
          })
          console.log("connect - moralis", res.data , accounts[0]);
        let canClaimWithKimono = false , kimono_id = "" , visibleFreeMint = false;
        for( let i = 0; i < res.data.total ; i ++ ) {
          if( res.data.result[i].name == "Kimono" ) {
            console.log("Kimono");
            visibleFreeMint = true;
            let res = await SmartContractObj.methods.canClaimWithKimino(res.data.result[i].token_id , accounts[0]).call();
            console.log("res",res);
            if( res == true ) {
              canClaimWithKimono = true;
              kimono_id = res.data.result[i].token_id;
              console.log("Yes");
              // i = res.data.total ; break;
            }
          }
        }
        
        dispatch(fetchDataSuccessInBlockchain({
          ...
          visibleFreeMint,
          canClaimWithKimono,
          kimono_id
        }));
        
        // Add listeners start
        ethereum.on("accountsChanged", (accounts) => {
          dispatch(updateAccount(accounts[0]));
        });
        ethereum.on("chainChanged", async () => {
          networkId = await ethereum.request({
            method: "net_version",
          });
          if( networkId !== "4") window.location.reload();
        });
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
