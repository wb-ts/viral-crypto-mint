// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
import axios from "axios";

import Web3Modal from 'web3modal';
import { providerOptions } from "./providerOptions";
import { ethers } from "ethers";

// log
import { fetchData , fetchDataSuccessInBlockchain } from "../data/dataActions";

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions // required
});

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

export const connect = async(account, api_key) => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const CONFIG = await configResponse.json();
    const abiResponse = await fetch(`/config/kimono_abi.json`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi_kimono = await abiResponse.json();
    const abiResponse_kabuto = await fetch(`/config/kabuto_abi.json`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi_kabuto = await abiResponse_kabuto.json();
    const abiResponse_katana = await fetch(`/config/katana_abi.json`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi_katana = await abiResponse_katana.json();

    try {

      const SmartContractObj_Kimono = new Web3EthContract(
        abi_kimono,
        CONFIG[0].CONTRACT_ADDRESS
      );
      const SmartContractObj_Katana = new Web3EthContract(
        abi_kabuto,
        CONFIG[1].CONTRACT_ADDRESS
      );
      const SmartContractObj_Kabuto = new Web3EthContract(
        abi_katana,
        CONFIG[2].CONTRACT_ADDRESS
      );
      dispatch(
        connectSuccess({
          account: account,
          smartContract_Kimono: SmartContractObj_Kimono,
          smartContract_Katana: SmartContractObj_Katana,
          smartContract_Kabuto: SmartContractObj_Kabuto,
        })
      );

      // Getting Owned Kimino NFTs

      const res = await axios.get(`https://deep-index.moralis.io/api/v2/${account}/nft?chain=rinkeby`, {
        headers: {
            "Content-type": "application/json",
            "X-API-Key": api_key
        }
        })
      let canClaimWithKimono = false , Kimono_id = -1 ;
      for( let i = 0; i < res.data.total ; i ++ ) {
        if( res.data.result[i].name == "Kimono" ) {
          canClaimWithKimono = await SmartContractObj_Kimono.methods.canClaimWithKimono(res.data.result[i].token_id , res.data.result[i].owner_of).call();
          if( canClaimWithKimono == true ) {
            Kimono_id = res.data.result[i].token_id;
            dispatch(
              fetchDataSuccessInBlockchain({
                canClaimWithKimono,
                Kimono_id
              })
            );
            i = res.data.total;
          }
        }
      }
      
    } catch (err) {
      dispatch(connectFailed("Something went wrong."));
    }

  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest(account));
    dispatch(await fetchData(account));
  };
};
