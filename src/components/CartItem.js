import React from 'react'
import {
    View, 
    Colors,  
    Drawer, 
    Text,
} from 'react-native-ui-lib'

const CartItem = ({item, _removeFromCart, numberFormatter}) => {
    const starIcon = require('../../assets/icons/delete.png')
    
    return (
        <Drawer
            key={Date.now()}
            leftItem={
                {
                    icon: starIcon,
                    background: Colors.green30,
                    onPress: () => _removeFromCart(item.product_id)
                }
            }
        >
            <View flex col style={{borderBottomWidth: 1}}>
                <View flex spread row paddingR-s2 paddingL-s4 borderWidth={0.4}>
                    <View borderRightWidth={0.5} flex-4>
                        <Text h4>{item.item_name}</Text>
                        <Text paddingH-s6 h6 style={{fontStyle: 'italic', fontSize: 12}}>{item.qty} {item.uom_name} x {numberFormatter(item.unit_price)} </Text>
                    </View>
                    <View flex-2 style={{alignItems: 'flex-end'}}>
                        <Text>{numberFormatter(item.unit_price * item.qty)}</Text>
                    </View>
                </View>
            </View>
        </Drawer>
    )
}

export default CartItem
