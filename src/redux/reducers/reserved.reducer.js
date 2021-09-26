import { 
    RESERVED_REQUEST, RESERVED_SUCCESS, RESERVED_FAILED,
} from '../constants'

const initialState = {
  reserved: [],
  page: 1,
  loading: false,
  error: null,
};

const reservedReducer = (state = initialState, action) => {
    switch (action.type) {
        case RESERVED_REQUEST:
            return { 
                ...state,
                loading: true
            };
        
        case RESERVED_SUCCESS:
            return { 
                ...state,
                reserved: action.payload.results,
                loading: false
            };
            
        case RESERVED_FAILED:
            return { 
                ...state,
                loading: false,
                error: action.payload()
            };
        
        default:
            return state;
    }
}

export default reservedReducer
