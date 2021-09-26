//import axios from '../api'
import axios from 'axios'
import {store} from '../store'
import { 
  ORDER_REQUEST, ORDER_SUCCESS, ORDER_FAILED,
  REQUEST, SUCCESS, FAILED,
  ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAILED,
  CLIENT_SUCCESS, CLIENT_FAILED, POST_ORDER_SUCCESS, POST_ORDER_FAILED
} from '../constants'


export const getOrders = () => {

  const {token, baseURL } = store.getState().loginReducer
  const page = store.getState().orderReducer.page
  
  return async dispatch => {
      dispatch({type: ORDER_REQUEST})
      await axios.get(`${baseURL}/orderList`, {
          headers: {
              Authorization: "Bearer "+token,
              timeout: 10000
          }
      }).then((res) => {
        if(res.data && res.status === 200){
          dispatch({
            type: ORDER_SUCCESS,
            payload: res.data
          })
        }
      }).catch(err => {
        dispatch({type: ORDER_FAILED, payload: ()=> {
          if(err.message.includes('timeout')){
              return `${server} server cannot be reached! Please try again or change server.`
          }
          else if(err.message.includes('Unauthenticated') || err.message.includes('Unauthorized')){
              return `Invalid Token on ${server} server! Please try again or change server.`
          }
          else {
              return `Something wnt wrong on ${server} server! Contact Administrator`
          }
        }})
    })
  }
}

export const getOrderDetails = (orderId) => {
  const {token, baseURL } = store.getState().loginReducer
  return async dispatch => {
      dispatch({type: ORDER_DETAILS_REQUEST})
      await axios.get(`${baseURL}/orderDetails/${orderId}`, {
          headers: {
              Authorization: "Bearer "+token,
          },
          timeout: 10000
      }).then((res) => {
        if(res.data && res.status === 200){
          dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: res.data
          })
        }
      }).catch(err => {
        dispatch({type: ORDER_DETAILS_FAILED, payload: () => {
          if(err.message.includes('timeout')){
              return `${server} server cannot be reached! Please try again or change server.`
          }
          else if(err.message.includes('Unauthenticated') || err.message.includes('Unauthorized')){
              return `Invalid Token on ${server} server! Please try again or change server.`
          }
          else {
              return `Something wnt wrong on ${server} server! Contact Administrator`
          }
        }})
    })
  }
}

export const postClient = (data) => {
  const { token, baseURL } = store.getState().loginReducer

  return async dispatch => {
      dispatch({type: ORDER_REQUEST})
      await axios.post(`${baseURL}/client/store`, data, {
          headers: {
              Authorization: "Bearer "+token,
          },
          timeout: 10000
      }).then((res) => {
        if(res.data && res.status === 200){
          dispatch({
            loading: false,
            type: CLIENT_SUCCESS,
            payload: res.data
          })
        }
      }).catch(err => {
        dispatch({type: CLIENT_FAILED, loading: false, payload: () => {
          if(err.message.includes('timeout')){
              return `${server} server cannot be reached! Please try again or change server.`
          }
          else if(err.message.includes('Unauthenticated') || err.message.includes('Unauthorized')){
              return `Invalid Token on ${server} server! Please try again or change server.`
          }
          else {
              return `Something wnt wrong on ${server} server! Contact Administrator`
          }
        }})
    })
  }
}

export const postOrder = (formData) => {

  const { token, baseURL } = store.getState().loginReducer
  return async dispatch => {
      dispatch({type: ORDER_REQUEST})
      await axios.post(`${baseURL}/order/store`, formData, {
          headers: {
              Authorization: "Bearer "+token,
          },
          timeout: 10000
      }).then((res) => {
        if(res.data && res.status === 200){
          dispatch({
            loading: false,
            type: POST_ORDER_SUCCESS,
            payload: res.data
          })
        }
      }).catch(err => {
        console.log(err)
        dispatch({type: POST_ORDER_FAILED, loading: false, payload: () => {
          if(err.message.includes('timeout')){
              return `${server} server cannot be reached! Please try again or change server.`
          }
          else if(err.message.includes('Unauthenticated') || err.message.includes('Unauthorized')){
              return `Invalid Token on ${server} server! Please try again or change server.`
          }
          else {
              return `Something wnt wrong on ${server} server! Contact Administrator`
          }
        }})
    })
  }
}