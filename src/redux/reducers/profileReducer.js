import { PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILED } from '../constants'

const initialState = {
  user: null,
  loading: false,
  error: null
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_REQUEST:
        return { 
            ...state, 
            loading: true
        };
    
    case PROFILE_SUCCESS:
        return { 
            ...state,
            user: action.payload.user,
            loading: false
        };

    case PROFILE_FAILED:
        return { 
            ...state,
            loading: false,
            error: action.payload()
        };
    default:
      return state;
  }
}

export default profileReducer;
