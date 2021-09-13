import { combineReducers } from 'redux'

import loginReducer from './loginReducer'
import profileReducer from './profileReducer'
import { orderReducer, orderDetailReducer } from './order.reducer'
import homeReducer from './home.reducer'

export default combineReducers({
    loginReducer,
    profileReducer,
    orderReducer,
    orderDetailReducer,
    homeReducer
});