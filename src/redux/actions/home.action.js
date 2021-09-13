import axios from '../api'
import { DASHBOARD_REQUEST, DASHBOARD_SUCCESS, DASHBOARD_FAILED } from '../constants'
import {store} from '../store'

export const userDashboard = () => {
    return async dispatch => {
        dispatch({type: DASHBOARD_REQUEST})
        await axios.get('/homie', {
            headers: {
                Authorization: "Bearer "+store.getState().loginReducer.token,
            }
        }).then((res) => {
            if(res.data && res.status === 200){
            dispatch({
                type: DASHBOARD_SUCCESS,
                payload: res.data
            })
            }
        }).catch(err => {
            console.log(err.payload)
            dispatch({type: DASHBOARD_FAILED, payload: err.payload.data})
        })
    }
}
