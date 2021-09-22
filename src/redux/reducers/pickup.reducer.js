import { 
    PICKUP_REQUEST, PICKUP_SUCCESS, PICKUP_FAILED,
} from '../constants'

const initialState = {
  pickups: [],
  page: 1,
  loading: false,
  error: null,
};

const pickupReducer = (state = initialState, action) => {
    switch (action.type) {
        case PICKUP_REQUEST:
            return { 
                ...state,
                loading: true
            };
        
        case PICKUP_SUCCESS:
            return { 
                ...state,
                pickups: action.payload.results,
                loading: false
            };
            
        case PICKUP_FAILED:
            return { 
                ...state,
                loading: false,
                error: action.payload.error
            };
        
        default:
            return state;
    }
}

export default pickupReducer
