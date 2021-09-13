import { 
    ORDER_REQUEST, ORDER_SUCCESS, ORDER_FAILED, ORDER_RESET,
    ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAILED,
    CLIENT_REQUEST, CLIENT_SUCCESS, CLIENT_FAILED, QTY_CHECK, POST_ORDER_SUCCESS, POST_ORDER_FAILED
} from '../constants'

const initialState = {
  orders: [],
  page: 1,
  loading: false,
  error: null
};

const orderDetailsState = {
    details: null,
    loading: false,
    error: null,
    msg: null,
}

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDER_REQUEST:
        return { 
            ...state,
            loading: true
        };
    
    case ORDER_SUCCESS:
        return { 
            ...state,
            //orders: [ ...state.orders, ...action.payload.data ],
            //orders: state.orders.concat(...action.payload.data),
            orders: action.payload,
            //page: action.payload.current_page + 1,
            loading: false
        };
        
    case ORDER_FAILED:
        return { 
            ...state,
            loading: false,
            error: action.payload.errors
        };
    
    case ORDER_RESET:
        return { 
            ...state,
            orrders: [],
            page: 1
        };
    
    case CLIENT_SUCCESS:
        return { 
            ...state,
            loading: false,
            msg: action.payload.message
        };
    
    case CLIENT_FAILED:
        return { 
            ...state,
            loading: false,
            error: action.payload.errors
        };

    case QTY_CHECK:
        return { 
            ...state,
            loading: false,
            msg: null
        };

    case POST_ORDER_SUCCESS:
        return { 
            ...state,
            loading: false,
            msg: null
        };
    
    case POST_ORDER_FAILED:
        console.log("Reducer", action.payload)
        return { 
            ...state,
            loading: false,
            error: action.payload
        };
    default:
      return state;
  }
}

export const orderDetailReducer = (state = orderDetailsState, action) => {
    switch (action.type) {
        case ORDER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case ORDER_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                details: action.payload.data
            }
        case ORDER_DETAILS_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload.errors
            }
        default:
            return state;
    }
}