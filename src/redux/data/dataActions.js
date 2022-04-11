// log
import store from "../store";
import { getProof } from '../../components/merkleTree';

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccessInData = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS_IN_DATA",
    payload: payload,
  };
};

export const fetchDataSuccessInBlockchain = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS_IN_BLOCKCHAIN",
    payload: payload,
  };
};


const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};



export const fetchData = async (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      const blockchain = store.getState().blockchain;

      // const minted_Kimono = Number(await blockchain.smartContract_Kimono.methods.totalSupply().call());
      // const minted_Kabuto = Number(await blockchain.smartContract_Kabuto.methods.totalSupply().call());
      // const minted_Katana = Number(await blockchain.smartContract_Katana.methods.totalSupply().call());
      const shiburaiDiscountAtAmount_Kimono = Number(await blockchain.smartContract_Kimono.methods.shiburaiDiscountAtAmount().call());
      const shiburaiDiscountAtAmount_Kabuto = Number(await blockchain.smartContract_Kabuto.methods.shiburaiDiscountAtAmount().call());
      const shiburaiDiscountAtAmount_Katana = Number(await blockchain.smartContract_Katana.methods.shiburaiDiscountAtAmount().call());

      const proof = await getProof(account);
      const reverted_Kimono = blockchain.smartContract_Kimono.methods.verifyClaim(account, proof).call();
      const reverted_Kabuto = blockchain.smartContract_Kabuto.methods.verifyClaim(account, proof).call();
      const reverted_Katana = blockchain.smartContract_Katana.methods.verifyClaim(account, proof).call();
      dispatch(
        fetchDataSuccessInData({
          // minted_Kimono,
          // minted_Kabuto,
          // minted_Katana,
          shiburaiDiscountAtAmount_Kimono,
          shiburaiDiscountAtAmount_Kabuto,
          shiburaiDiscountAtAmount_Katana,
          reverted_Kimono,
          reverted_Kabuto,
          reverted_Katana
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
