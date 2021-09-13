import React from 'react';
import {Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';


const Sidebar = ({progress, ...props}) => {
    const translateX = Animated.interpolate(progress, {
        inputRange: [0,1],
        outputRange: [-100, 0]
    });

    return (
        <DrawerContentScrollView {...props}>
            <Animated.View style={{ transform: {{translateX}} }}>
                <DrawerItemList {...props} />
                <DrawerItem 
                    label="Products" 
                    icon={({size, color}) => (
                        <AntDesign name="shoppingcart" color={color} size={size} />
                    )} 
                />
            </Animated.View>
        </DrawerContentScrollView>
    )
}

export default Sidebar
