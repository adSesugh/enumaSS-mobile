import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import LoginScreen from '../screens/LoginScreen';

const AuthStack = createNativeStackNavigator()

const AuthNavigaor = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        </AuthStack.Navigator>
    )
}

export default AuthNavigaor
