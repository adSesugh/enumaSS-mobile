import { combineReducers } from 'redux'

import loginReducer from './loginReducer'
import profileReducer from './profileReducer'
import { orderReducer, orderDetailReducer } from './order.reducer'
import homeReducer from './home.reducer';
import reservedReducer from './reserved.reducer';
import receivableReducer from './receivable.reducer';
import pickupReducer from './pickup.reducer';
import paymentsReducer from './payments.reducer';
import customersReducer from './customers.reducer';
import productReducer from './product.reducer';

export default combineReducers({
    loginReducer,
    profileReducer,
    orderReducer,
    orderDetailReducer,
    homeReducer,
    reservedReducer,
    receivableReducer,
    pickupReducer,
    paymentsReducer,
    customersReducer,
    productReducer
});