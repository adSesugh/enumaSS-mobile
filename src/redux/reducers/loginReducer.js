import { 
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILED,
    LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILED, SET_BASEURL
 } from '../constants'

const initialState = {
  token: null,
  baseURL: null,
  user: null,
  loading: false,
  error: null
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BASEURL:
        return { 
            ...state,
            baseURL: action.payload,
            error: null
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
            user: action.payload.user,
            loading: false,
            error: null
        };

    case LOGIN_FAILED:
        return { 
            ...state,
            loading: false,
            error: action.payload
        };
    
    case LOGOUT_SUCCESS:
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
