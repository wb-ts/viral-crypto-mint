const initialState = {
  loading: false,
  minted: 0,
  canClaimWithKimono: false,
  kimono_id: '',
  shiburaiDiscountAtAmount: 0,
  reverted: false,
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        totalSupply: action.payload.totalSupply,
        minted: action.payload.minted,
        canClaimWithKimono: action.payload.canClaimWithKimono,
        shiburaiDiscountAtAmount: action.payload.shiburaiDiscountAtAmount,
        reverted: action.payload.reverted,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
