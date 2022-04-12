import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
require('dotenv').config();


export const providerOptions = {

  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "Web 3 Modal Demo", // Required
      infuraId: process.env.REACT_APP_INFURA_KEY // Required unless you provide a JSON RPC url; see `rpc` below
    }
  },
  walletconnect: {
    package: WalletConnect, // required
    options: {
      infuraId: process.env.REACT_APP_INFURA_KEY // required
    },
    qrcode: true,
    qrcodeModalOptions: {
        mobileLinks: [
          "metamask",
          "trust",
        ]
    }
    
  }
};
