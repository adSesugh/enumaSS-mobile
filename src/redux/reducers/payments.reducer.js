import { 
    PAYMENTS_REQUEST, PAYMENTS_SUCCESS, PAYMENTS_FAILED,
} from '../constants'

const initialState = {
  payments: [],
  page: 1,
  loading: false,
  error: null,
};

const paymentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case PAYMENTS_REQUEST:
            return { 
                ...state,
                loading: true
            };
        
        case PAYMENTS_SUCCESS:
            return { 
                ...state,
                payments: action.payload.results,
                loading: false
            };
            
        case PAYMENTS_FAILED:
            return { 
                ...state,
                loading: false,
                error: action.payload()
            };
        
        default:
            return state;
    }
}

export default paymentsReducer
