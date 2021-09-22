//import axios from '../api'
import axios from 'axios';
import {store} from '../store'
import { 
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILED,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILED, SET_BASEURL
 } from '../constants'

export const userLogin = (data) => {
  const baseUrl = store.getState().loginReducer.baseURL;
  console.log(baseUrl)
  return async dispatch => {
    dispatch({type: LOGIN_REQUEST})
    await axios.post(`${baseUrl}/authenticate`, data).then((res) => {
      if(res.data && res.status === 200){
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        })
      }
      else if(res.status === 401 || res.status === 403) {
        dispatch({
          type: LOGIN_FAILED,
          payload: 'Unauthorized Access'
        })
      }
      else if(res.status === 503) {
        dispatch({
          type: LOGIN_FAILED,
          payload: 'Timeout Reaching server'
        })
      }
      else {
        dispatch({
          type: LOGIN_FAILED,
          payload: 'Something went wrong!'
        })
      }
    }).catch((err) => {
      console.log('err', err.data)
      console.log('mssa', err.message)
        dispatch({
          type: LOGIN_FAILED,
          payload: 'Network Error'
        })
    })
  }
}

export const userLogOut = (data) => {
  const {token, baseURL } = store.getState().loginReducer
  return async dispatch => {
    dispatch({type: 'DASHBOARD_REQUEST'})
    await axios
      .get(`${baseURL}/logout`, {
          headers: {
              Authorization: `Bearer ${token}`,
              timeout: 10000
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

export const saveBaseURL = (value) => {
  return dispatch => {
    if(value) {
        dispatch({
          type: 'SET_BASEURL',
          payload: 'http://enumastore.ngrok.io/api'
        })
        console.log('online')
    }
    else {
        dispatch({
          type: 'SET_BASEURL',
          payload: 'http://192.168.1.192/api'
        })
        console.log('local')
    }   
  }
}