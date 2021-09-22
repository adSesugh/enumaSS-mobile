import axios from 'axios'
import {store} from '../store'
import { 
  RESERVED_REQUEST, RESERVED_SUCCESS, RESERVED_FAILED,
  RECEIVABLE_REQUEST, RECEIVABLE_SUCCESS, RECEIVABLE_FAILED,
  PICKUP_REQUEST, PICKUP_SUCCESS, PICKUP_FAILED,
  PAYMENTS_REQUEST, PAYMENTS_SUCCESS, PAYMENTS_FAILED,
  CUSTOMER_REQUEST, CUSTOMER_SUCCESS, CUSTOMER_FAILED, CLIENT_RESET,
  PRODUCT_REQUEST, PRODUCT_SUCCESS, PRODUCT_FAILED
} from '../constants'

export const getReservedOrders = () => {

  const {token, baseURL } = store.getState().loginReducer
  const page = store.getState().reservedReducer.page
  
  return async dispatch => {
    dispatch({type: RESERVED_REQUEST})
    const res = await axios.get(`${baseURL}/reservedList`, {
          headers: {
              Authorization: "Bearer "+token
          },
          timeout: 10000
      });

    if(res.data && res.status === 200) {
      dispatch({
        type: RESERVED_SUCCESS,
        payload: res.data
      })
    }
    else if(res.status === 403) {
      dispatch({
        type: RESERVED_FAILED,
        payload: res.data
      })
    }
  }
}

export const getReceivables = () => {

  const {token, baseURL } = store.getState().loginReducer
  const page = store.getState().receivableReducer.page
  
  return async dispatch => {
    dispatch({type: RECEIVABLE_REQUEST})
    const res = await axios.get(`${baseURL}/receivableList`, {
          headers: {
              Authorization: "Bearer "+token
          },
          timeout: 10000
      });

    if(res.data && res.status === 200) {
      dispatch({
        type: RECEIVABLE_SUCCESS,
        payload: res.data
      })
    }
    else if(res.status === 403) {
      dispatch({
        type: RECEIVABLE_FAILED,
        payload: res.data
      })
    }
  }
}

export const getPickups = () => {

  const {token, baseURL } = store.getState().loginReducer
  
  return async dispatch => {
    dispatch({type: PICKUP_REQUEST})
    const res = await axios.get(`${baseURL}/pickupList`, {
          headers: {
              Authorization: "Bearer "+token
          },
          timeout: 10000
      });

    if(res.data && res.status === 200) {
      dispatch({
        type: PICKUP_SUCCESS,
        payload: res.data
      })
    }
    else if(res.status === 403) {
      dispatch({
        type: PICKUP_FAILED,
        payload: res.data
      })
    }
  }
}

export const getPayments = () => {
  const {token, baseURL } = store.getState().loginReducer
  return async dispatch => {
    dispatch({type: PAYMENTS_REQUEST})
    const res = await axios.get(`${baseURL}/paymentList`, {
          headers: {
              Authorization: "Bearer "+token
          },
          timeout: 10000
      });

    if(res.data && res.status === 200) {
      console.log(res.data)
      dispatch({
        type: PAYMENTS_SUCCESS,
        payload: res.data
      })
    }
    else if(res.status === 403) {
      dispatch({
        type: PAYMENTS_FAILED,
        payload: res.data
      })
    }
  }
}

export const getClientList = () => {

  const {token, baseURL } = store.getState().loginReducer
  const page = store.getState().customersReducer.page
  console.log(page)
  return async dispatch => {
    dispatch({type: CUSTOMER_REQUEST})
    dispatch({type: CLIENT_RESET})
    const res = await axios.get(`${baseURL}/clientList?page=${page}`, {
          headers: {
              Authorization: "Bearer "+token
          },
          timeout: 10000
      });

    if(res.data && res.status === 200) {
      dispatch({
        type: CUSTOMER_SUCCESS,
        payload: res.data
      })
    }
    else if(res.status === 403) {
      dispatch({
        type: CUSTOMER_FAILED,
        payload: res.data
      })
    }
  }
}

export const getMoreClient = () => {

  const {token, baseURL } = store.getState().loginReducer
  const page = store.getState().customersReducer.page
  
  return async dispatch => {
    const res = await axios.get(`${baseURL}/clientList?page=${page}`, {
          headers: {
              Authorization: "Bearer "+token
          },
          timeout: 10000
      });

    if(res.data && res.status === 200) {
      dispatch({
        type: CUSTOMER_SUCCESS,
        payload: res.data
      })
    }
    else if(res.status === 403) {
      dispatch({
        type: CUSTOMER_FAILED,
        payload: res.data
      })
    }
  }
}

export const getProductList = () => {

  const {token, baseURL } = store.getState().loginReducer
  const page = store.getState().productReducer.page
  
  return async dispatch => {
    dispatch({type: PRODUCT_REQUEST})
    const res = await axios.get(`${baseURL}/productList?page=${page}`, {
          headers: {
              Authorization: "Bearer "+token
          },
          timeout: 10000
      });

    if(res.data && res.status === 200) {
      dispatch({
        type: PRODUCT_SUCCESS,
        payload: res.data
      })
    }
    else if(res.status === 403) {
      dispatch({
        type: PRODUCT_FAILED,
        payload: res.data
      })
    }
  }
}

export const getMoreProduct = () => {

  const {token, baseURL } = store.getState().loginReducer
  const page = store.getState().productReducer.page
  
  return async dispatch => {
    const res = await axios.get(`${baseURL}/productList?page=${page}`, {
          headers: {
              Authorization: "Bearer "+token
          },
          timeout: 10000
      });

    if(res.data && res.status === 200) {
      dispatch({
        type: PRODUCT_SUCCESS,
        payload: res.data
      })
    }
    else if(res.status === 403) {
      dispatch({
        type: PRODUCT_FAILED,
        payload: res.data
      })
    }
  }
}