import { 
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILED,
    LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILED, SET_BASEURL
 } from '../constants'

const initialState = {
  token: null,
  baseURL: null,
  isAdmin: null,
  loading: false,
  error: null
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BASEURL:
        return { 
            ...state,
            baseURL: action.payload
        };

    case LOGIN_REQUEST:
        return { 
            ...state, 
            loading: true
        };
    
    case LOGIN_SUCCESS:
        return { 
            ...state, 
            token: action.payload.token,
            isAdmin: action.payload.isAdmin,
            loading: false
        };

    case LOGIN_FAILED:
        return { 
            ...state,
            loading: false,
            error: action.payload.errors
        };
    
    case LOGOUT_SUCCESS:
        console.log(action.payload)
        return { 
            ...state, 
            token: null,
            loading: false
        };

    case LOGOUT_FAILED:
        return { 
            ...state,
            loading: false
        };
    default:
      return state;
  }
}

export default loginReducer;
