// log
import store from "../store";
import { getProof } from '../../components/merkleTree';

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};



export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let blockchain = await store.getState().blockchain;

      let minted = await blockchain.smartContract.methods.totalSupply();
      let canClaimWithKimono = await blockchain.smartContract.methods.canClaimWithKimono(0 , blockchain.account);
      let shiburaiDiscountAtAmount = Number(await blockchain.smartContract.methods.shiburaiDiscountAtAmount().call());
      let reverted = false;

      let proof = await getProof(blockchain.account);

      blockchain.smartContract.methods
      .claim(proof)
      .call()
      .then( (res) =>{
        console.log("SUCCESS");
        reverted = true;
      })
      .catch(
        console.log("Error")
      )

      dispatch(
        fetchDataSuccess({
          minted,
          canClaimWithKimono,
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
