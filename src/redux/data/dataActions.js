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



export const fetchData = (account , smartContract) => {
  console.log(smartContract);
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {

      let minted = await smartContract.methods.totalSupply();
      let shiburaiDiscountAtAmount = Number(await smartContract.methods.shiburaiDiscountAtAmount().call());

      let proof = await getProof(account);
      let reverted = await smartContract.methods.claim(proof).call();
      dispatch(
        fetchDataSuccessInData({
          ...
          minted,
          shiburaiDiscountAtAmount,
          reverted
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
