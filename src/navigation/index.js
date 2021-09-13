import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'

import AuthNavigaor from './AuthNavigator'
import TabNavgator from './TabNavigator'
import { useSelector } from 'react-redux'

const Navigation = () => {
    const {token} = useSelector(state => state.loginReducer)
    return (
        <NavigationContainer>
            {token ? <TabNavgator/> : <AuthNavigaor/>}
        </NavigationContainer>
    )
}

export default Navigation