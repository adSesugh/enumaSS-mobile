import { 
    RECEIVABLE_REQUEST, RECEIVABLE_SUCCESS, RECEIVABLE_FAILED,
} from '../constants'

const initialState = {
  receivables: [],
  page: 1,
  loading: false,
  error: null,
};

const receivableReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVABLE_REQUEST:
            return { 
                ...state,
                loading: true
            };
        
        case RECEIVABLE_SUCCESS:
            return { 
                ...state,
                receivables: action.payload.results,
                loading: false
            };
            
        case RECEIVABLE_FAILED:
            return { 
                ...state,
                loading: false,
                error: action.payload.error
            };
        
        default:
            return state;
    }
}

export default receivableReducer
