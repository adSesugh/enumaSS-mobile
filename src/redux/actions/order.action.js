import axios from '../api'
import {store} from '../store'
import { 
  ORDER_REQUEST, ORDER_SUCCESS, ORDER_FAILED,
  ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAILED,
  CLIENT_SUCCESS, CLIENT_FAILED, POST_ORDER_SUCCESS, POST_ORDER_FAILED
} from '../constants'


export const getOrders = () => {

  const token = store.getState().loginReducer.token
  const page = store.getState().orderReducer.page
  
  return async dispatch => {
      dispatch({type: ORDER_REQUEST})
      await axios.get(`/orderList`, {
          headers: {
              Authorization: "Bearer "+token
          }
      }).then((res) => {
        if(res.data && res.status === 200){
          dispatch({
            type: ORDER_SUCCESS,
            payload: res.data
          })
        }
      }).catch(err => {
        dispatch({type: ORDER_FAILED, payload: err.payload.data})
    })
  }
}

export const getOrderDetails = (orderId) => {
  const token = store.getState().loginReducer.token
  return async dispatch => {
      dispatch({type: ORDER_DETAILS_REQUEST})
      await axios.get(`/orderDetails/${orderId}`, {
          headers: {
              Authorization: "Bearer "+token
          }
      }).then((res) => {
        if(res.data && res.status === 200){
          dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: res.data
          })
        }
      }).catch(err => {
        dispatch({type: ORDER_DETAILS_FAILED, payload: err.payload.data})
    })
  }
}

export const postClient = (data) => {
  const token = store.getState().loginReducer.token

  return async dispatch => {
      dispatch({type: ORDER_REQUEST})
      await axios.post('/client/store', data, {
          headers: {
              Authorization: "Bearer "+token
          }
      }).then((res) => {
        if(res.data && res.status === 200){
          dispatch({
            loading: false,
            type: CLIENT_SUCCESS,
            payload: res.data
          })
        }
      }).catch(err => {
        console.log(err)
        dispatch({type: CLIENT_FAILED, loading: false, payload: err.payload.data})
    })
  }
}

export const postOrder = (formData) => {

  const token = store.getState().loginReducer.token
  return async dispatch => {
      dispatch({type: ORDER_REQUEST})
      await axios.post('/order/store', formData, {
          headers: {
              Authorization: "Bearer "+token
          }
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
        dispatch({type: POST_ORDER_FAILED, loading: false, payload: err.payload})
    })
  }
}