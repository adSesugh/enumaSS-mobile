//import axios from '../api'
import axios from 'axios';
import { DASHBOARD_REQUEST, DASHBOARD_SUCCESS, DASHBOARD_FAILED } from '../constants'
import {store} from '../store'

export const userDashboard = () => {
    const {baseURL, server, token} = store.getState().loginReducer;
    return async dispatch => {
        dispatch({type: DASHBOARD_REQUEST})
        await axios.get(`${baseURL}/homie`, {
            headers: {
                Authorization: "Bearer "+token,
            }, 
            timeout: 10000
        }).then((res) => {
            if(res.data && res.status === 200){
            dispatch({
                type: DASHBOARD_SUCCESS,
                payload: res.data
            })
            }
        }).catch(err => {
            dispatch({type: DASHBOARD_FAILED, payload: () => {
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
