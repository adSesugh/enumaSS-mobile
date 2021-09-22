import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'

import AuthNavigaor from './AuthNavigator'
import TabNavgator from './TabNavigator'
import DrawerNavigator from './DrawerNavigator';
import { useSelector } from 'react-redux'

const Navigation = () => {
    const {token, user } = useSelector(state => state.loginReducer)
    return (
        <NavigationContainer>
            {(token && user?.isAdmin === 1) ? <DrawerNavigator /> : token ? <TabNavgator/> : <AuthNavigaor/>}
        </NavigationContainer>
    )
}

export default Navigation