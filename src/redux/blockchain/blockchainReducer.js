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
      if(action.payload.smartContract_Kimono) return {
        ...state,
        loading: false,
        account: action.payload.account,
        smartContract_Kimono: action.payload.smartContract_Kimono,
        web3: action.payload.web3,
      };
      if(action.payload.smartContract_Katana) return {
        ...state,
        loading: false,
        account: action.payload.account,
        smartContract_Katana: action.payload.smartContract_Katana,
        web3: action.payload.web3,
      };
      if(action.payload.smartContract_Kabuto) return {
        ...state,
        loading: false,
        account: action.payload.account,
        smartContract_Kabuto: action.payload.smartContract_Kabuto,
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
