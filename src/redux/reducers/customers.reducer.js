import { 
    CUSTOMER_REQUEST, CUSTOMER_SUCCESS, CUSTOMER_FAILED, CLIENT_RESET
} from '../constants'

const initialState = {
  customers: [],
  page: 1,
  loading: false,
  error: null,
};

const customersReducer = (state = initialState, action) => {
    switch (action.type) {
        case CUSTOMER_REQUEST:
            return { 
                ...state,
                loading: true
            };
        
        case CUSTOMER_SUCCESS:
            return { 
                ...state,
                //customers: [ ...state.customers, ...action.payload.data ],
                customers: state.customers.concat(...action.payload.data),
                page: action.payload.current_page + 1,
                loading: false
            };
            
        case CUSTOMER_FAILED:
            return { 
                ...state,
                loading: false,
                error: action.payload.error
            };
        
        case CLIENT_RESET:
            return { 
                ...state,
                customers: [],
                page: 1
            };
        
        default:
            return state;
    }
}

export default customersReducer