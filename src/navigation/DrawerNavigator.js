import React from 'react';
import {Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons'
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../screens/HomeScreen';
import OrderScreen from '../screens/OrderScreen';
import ProductScreen from '../screens/ProductScreen';

import Sidebar from './Sidebar'

const Drawer = createDrawerNavigator();
 
const DrawerNavigator = () => {
    return (
        <Drawer.Navigator drawerContent={props => <Sidebar {...props} />}>
            <Drawer.Screen 
                name="Dashboard" 
                component={HomeScreen} 
                options={{ 
                    drawerIcon: ({focus, color, size}) => (
                        <AntDesign name="home" color={color} size={size} />
                    )
                }}
            />
            <Drawer.Screen 
                name="OrderTab" 
                component={OrderScreen} 
                options={{ 
                    drawerIcon: ({focus, color, size}) => (
                        <AntDesign name="shoppingcart" color={color} size={size} />
                    ),
                    title: 'Sales Order'
                }}
            />
            <Drawer.Screen 
                name="Product" 
                component={ProductScreen} 
                options={{ 
                    drawerIcon: ({focus, color, size}) => (
                        <AntDesign name="shoppingcart" color={color} size={size} />
                    ),
                }}
            />
        </Drawer.Navigator>
    )
}

export default DrawerNavigator
