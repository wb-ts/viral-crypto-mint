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



export const fetchData = (account , smartContract) => {
  console.log(smartContract);
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {

      let minted = await smartContract.methods.totalSupply();
      let canClaimWithKimono = await smartContract.methods.canClaimWithKimono(0 , account);
      let shiburaiDiscountAtAmount = Number(await smartContract.methods.shiburaiDiscountAtAmount().call());
      let reverted = false;

      let proof = await getProof(account);

      smartContract.methods
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
          ...
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
