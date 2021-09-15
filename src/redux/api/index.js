import axios from 'axios'
import {store} from '../store'

const baseUrl = store.getState().loginReducer.baseURL;

const instance = axios.create({
    baseURL: baseUrl,
    timeout: 10000
})

export default instance