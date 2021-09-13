import { DASHBOARD_REQUEST, DASHBOARD_SUCCESS, DASHBOARD_FAILED } from '../constants'

const initialState = {
  rdash: null,
  loading: false,
  error: null
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD_REQUEST:
        return { 
            ...state, 
            loading: true
        };
    
    case DASHBOARD_SUCCESS:
        return { 
            ...state,
            rdash: action.payload,
            loading: false
        };

    case DASHBOARD_FAILED:
        return { 
            ...state,
            loading: false,
            error: action.payload.errors
        };
    default:
      return state;
  }
}

export default homeReducer;
