//import axios from '../api'
import axios from 'axios';
import {store} from '../store'
import { 
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILED,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILED, SET_BASEURL
 } from '../constants'

export const userLogin = (data) => {
  const { server, baseURL } = store.getState().loginReducer;
  return async dispatch => {
    dispatch({type: LOGIN_REQUEST})
    await axios.post(`${baseURL}/authenticate`, data, {timeout: 10000}).then((res) => {
      if(res.data && res.status === 200){
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        })
      }
    }).catch((err) => {
        dispatch({
          type: LOGIN_FAILED,
          payload: () => {
            if(err.message.includes('timeout')){
                return `${server} server cannot be reached! Please try again or change server.`
            }
            else if(err.message.includes('Unauthenticated') || err.message.includes('Unauthorized')){
                return `Invalid Token on ${server} server! Please try again or change server.`
            }
            else {
                return `Something wnt wrong on ${server} server! Contact Administrator`
            }
          }
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
              Authorization: `Bearer ${token}`
          },
          timeout: 5000
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
      }).catch(err => {

      });
  }
}

export const saveBaseURL = (value) => {
  return dispatch => {
    if(value) {
        dispatch({
          type: 'SET_BASEURL',
          payload: {url: 'http://enumastore.ngrok.io/api', server: 'online'}
        })
        console.log('online')
    }
    else {
        dispatch({
          type: 'SET_BASEURL',
          payload: {url: 'http://192.168.1.192/api', server: 'local'}
        })
        console.log('local')
    }   
  }
}