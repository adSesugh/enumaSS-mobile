import { 
    PRODUCT_REQUEST, PRODUCT_SUCCESS, PRODUCT_FAILED, PRODUCT_RESET
} from '../constants'

const initialState = {
  products: [],
  page: 1,
  loading: false,
  error: null,
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case PRODUCT_REQUEST:
            return { 
                ...state,
                loading: true
            };
        
        case PRODUCT_SUCCESS:
            return { 
                ...state,
                products: state.products.concat(...action.payload.data),
                page: action.payload.current_page + 1,
                loading: false
            };
            
        case PRODUCT_FAILED:
            return { 
                ...state,
                loading: false,
                error: action.payload.error
            };

        case PRODUCT_RESET:
            return { 
                ...state,
                products: [],
                page: 1
            };
        
        default:
            return state;
    }
}

export default productReducer
