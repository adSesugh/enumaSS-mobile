import axios from '../api'
import {store} from '../store'
import { 
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILED,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILED
 } from '../constants'

export const userLogin = (data) => {
  return async dispatch => {
    dispatch({type: LOGIN_REQUEST})
    await axios.post('/authenticate', data).then((res) => {
      if(res.data && res.status === 200){
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        })
      }
    }).catch(err => {
        dispatch({
          type: LOGIN_FAILED,
          payload: err.response.data
        })
    })
  }
}

export const userLogOut = (data) => {
  const token = store.getState().loginReducer.token
  return async dispatch => {
    dispatch({type: 'DASHBOARD_REQUEST'})
    await axios
      .get("/logout", {
          headers: {
              Authorization: `Bearer ${token}`
          }
      })
      .then(res => {
        console.log(res)
        if(res.data && res.status === 200){
          dispatch({type: 'DASHBOARD_SUCCESS'})
          dispatch({
            type: LOGOUT_SUCCESS,
            payload: res.data
          })
        }
      }).catch(err => console.error(err));
  }
}
