//import axios from '../api'
import axios from 'axios'
import { PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILED } from '../constants'
import {store} from '../store'

export const userProfile = () => {
  try {
    const {token, baseURL} = store.getState().loginReducer
    return async dispatch => {
        dispatch({type: PROFILE_REQUEST})
        const res = await axios.get(`${baseURL}/me`, {
            headers: {
                Authorization: "Bearer "+token,
                timeout: 10000
            }
        });
        
        if (res.data && res.status === 200) {
            dispatch({
            type: PROFILE_SUCCESS,
            payload: res.data
            });
        } else {
            console.log(res.error)
            dispatch({type: PROFILE_FAILED, payload: res.error})
        }
    };
  } catch (error) {
    console.log(error);
  }
}
