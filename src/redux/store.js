import { createStore, applyMiddleware } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from "redux-persist";
import thunk from 'redux-thunk';
import logger from 'redux-logger'

import rootReducer from './reducers'

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ['loginReducer' ],
    blacklist: []
};

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer, applyMiddleware(thunk, logger));
export const persistor = persistStore(store);