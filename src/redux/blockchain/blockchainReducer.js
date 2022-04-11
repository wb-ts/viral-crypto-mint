const initialState = {
  loading: false,
  account: null,
  smartContract_Kimono: null,
  smartContract_Kabuto: null,
  smartContract_Katana: null,
  web3: null,
  errorMsg: "",
};

const blockchainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CONNECTION_REQUEST":
      return {
        ...initialState,
        loading: true,
      };
    case "CONNECTION_SUCCESS":
      return {
        ...state,
        loading: false,
        account: action.payload.account,
        smartContract_Kimono: action.payload.smartContract_Kimono,
        smartContract_Kabuto: action.payload.smartContract_Kabuto,
        smartContract_Katana: action.payload.smartContract_Katana,
        web3: action.payload.web3,
      };
    case "CONNECTION_FAILED":
      return {
        ...initialState,
        loading: false,
        errorMsg: action.payload,
      };
    case "UPDATE_ACCOUNT":
      return {
        ...state,
        account: action.payload.account,
      };
    default:
      return state;
  }
};

export default blockchainReducer;
