import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://192.168.101.88:8000/api',
    //baseURL: 'http://192.168.1.77:8000/api',
    //baseURL: 'http://192.168.1.192/api',
    //baseURL: 'http://enumastore.ngrok.io/api',
    timeout: 10000
})

export default instance