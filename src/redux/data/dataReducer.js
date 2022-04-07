const initialState = {
  loading: false,
  visibleFreeMint : false,
  canClaimWithKimono: false,
  Kimono_id: '',
  minted: 0,
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
    case "CHECK_DATA_SUCCESS_IN_DATA":
      return {
        ...state,
        loading: false,
        minted: action.payload.minted,
        shiburaiDiscountAtAmount: action.payload.shiburaiDiscountAtAmount,
        reverted: action.payload.reverted,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS_IN_BLOCKCHAIN":
      return {
        ...state,
        loading: false,
        visibleFreeMint: action.payload.visibleFreeMint,
        canClaimWithKimono: action.payload.canClaimWithKimono,
        Kimono_id: action.payload.Kimono_id,
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
