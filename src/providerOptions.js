import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
const INFURA_KEY = "621c97155b4a4610b5f113dce79b6d5e";


export const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "Web 3 Modal Demo", // Required
      infuraId: INFURA_KEY // Required unless you provide a JSON RPC url; see `rpc` below
    },
    chainId: "4"
  },
  walletconnect: {
    package: WalletConnect, // required
    options: {
      infuraId: INFURA_KEY // required
    },
    chainId: "4"
  }
};
