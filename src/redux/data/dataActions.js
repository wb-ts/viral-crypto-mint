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



export const fetchData = async (account , smartContract , CONTRACT_ADDRESS) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {

      let minted = Number(await smartContract.methods.totalSupply().call());
      let shiburaiDiscountAtAmount = Number(await smartContract.methods.shiburaiDiscountAtAmount().call());

      let proof = await getProof(account);
      let reverted = true;
      smartContract.methods.claim(proof).send({
        gasLimit: "3000000",
        to: CONTRACT_ADDRESS,
        from: account,
        value: "0"
      });
      let isPaused =await smartContract.methods.isPaused().call();
      reverted = -isPaused ;
      dispatch(
        fetchDataSuccessInData({
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
