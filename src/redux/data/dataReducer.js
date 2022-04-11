const initialState = {
  loading: false,
  canClaimWithKimono: false,
  Kimono_id: -1 ,
  // minted_Kimono: 0,
  // minted_Kabuto: 0,
  // minted_Katana: 0,
  shiburaiDiscountAtAmount_Kimono: 0,
  shiburaiDiscountAtAmount_Kabuto: 0,
  shiburaiDiscountAtAmount_Katana: 0,
  reverted_Kimono: true,
  reverted_Kabuto: true,
  reverted_Katana: true,
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
        // minted_Kimono: action.payload.minted_Kimono,
        // minted_Kabuto: action.payload.minted_Kabuto,
        // minted_Katana: action.payload.minted_Katana,
        shiburaiDiscountAtAmount_Kimono: action.payload.shiburaiDiscountAtAmount_Kimono,
        shiburaiDiscountAtAmount_Kabuto: action.payload.shiburaiDiscountAtAmount_Kabuto,
        shiburaiDiscountAtAmount_Katana: action.payload.shiburaiDiscountAtAmount_Katana,
        reverted: action.payload.reverted,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS_IN_BLOCKCHAIN":
      return {
        ...state,
        loading: false,
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
