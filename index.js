import 'react-native-gesture-handler';
import React from 'react'
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux'
import { store, persistor } from './src/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import * as ScreenOrientation from 'expo-screen-orientation'

import App from './App';

const RNApp = () => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    )
}

registerRootComponent(RNApp);
