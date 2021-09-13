import React from 'react'
import moment from 'moment';
import PropTypes from 'prop-types';
import {StyleSheet, Alert, ToastAndroid} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import {AnimatableManager, Chip, Colors, Spacings, ListItem, Text, Avatar, AvatarHelper, Drawer, Button } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'
import axios from '../redux/api'

const collectionsIcon = require('../../assets/icons/collections.png');
const starIcon = require('../../assets/icons/star.png');
const shareIcon = require('../../assets/icons/share.png');


const OrderItem = ({ item, index, addRef }) => {

    const navigation = useNavigation()
    const between = (x, min, max) => x >= min && x <= max
    const avatarBadgeProps = {backgroundColor: between(item.status_id, 1,4) ? Colors.yellow20 : between(item.status_id, 9, 10) ? Colors.green20 : Colors.blue20};
    const buttonPress = () => Alert.alert('Badge button press');
    const listOnPress = () => navigation.navigate('OrderDetail', {orderId: item.id});
    const imageSource = item.thumbnail ? {uri: item.thumbnail} : null;
    const animationProps = AnimatableManager.getEntranceByIndex(item.id)
    const {token} = useSelector(state => state.loginReducer)

    const styles = StyleSheet.create({
        border: {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: Colors.dark70,
            paddingRight: 4
        },
        avatar: {
            marginHorizontal: 4,
            backgroundColor: between(item.status_id, 1,4) ? Colors.yellow20 : between(item.status_id, 9, 10) ? Colors.green20 : Colors.blue20,
            color: Colors.dark80,
        },
        middle: {
            marginBottom: 3
        },
        text: {
            flex: 1,
            marginRight: 10
        },
        subtitle: {
            marginTop: 2
        }
    });
  
    const numberFormatter = (number) => {
        return new Intl.NumberFormat('en-US').format(number)
    }

    const _invoiceOrder = async (orderId) => {
        await axios
          .get(`/invoice/store/${orderId}`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          })
          .then(res => {
                if(res.status === 200) {
                    ToastAndroid.show("Order Invoiced successfully!", ToastAndroid.SHORT);
                }
          })
          .catch(err => console.error(err));
    }

    const leftButton = {
        text: 'INVOICE',
        icon: shareIcon,
        background: Colors.dark60,
        onPress: () => Alert.alert('Confirm Action', 'Are you sure to convert order to invoice', [
            {
                text: "CANCEL"
            },
            { text: "YES", onPress: () => _invoiceOrder(item.id) }
        ]) 
    };

    const rightButtons = [
        {
            text: 'PAY',
            icon: collectionsIcon,
            background: Colors.green20,
            onPress: () => Alert.alert('Confirm Action', 'Are you sure make payment for this order?', [
                {
                    text: "CANCEL"
                },
                { text: "YES", onPress: () => navigation.navigate('Payment', {orderId: item.id}) }
            ])
        },
    ];
    
    return (
        <AnimatableView {...animationProps}>
            <Drawer
                leftItem={item.status_id === 3 ? leftButton : {background: Colors.blue20}}
                rightItems={item.status_id === 8 ? rightButtons : []}
                ref={r => addRef(r, index)}
                key={Date.now()}
                index={index}
            >
                <ListItem
                    height={75.8}
                    onPress={listOnPress}
                >
                    <ListItem.Part left>
                        <Avatar
                            size={54}
                            source={imageSource}
                            badgeProps={avatarBadgeProps}
                            label={AvatarHelper.getInitials(item.name)}
                            containerStyle={styles.avatar}
                        />
                    </ListItem.Part>
                    <ListItem.Part middle column containerStyle={styles.border}>
                        <ListItem.Part containerStyle={styles.middle}>
                            <Text style={styles.text} text70 color={Colors.dark10} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.subtitle} text90 color={Colors.dark20}>{'\u20A6'}{numberFormatter(item.amount)}</Text>
                        </ListItem.Part>
                        <ListItem.Part>
                            <Text style={styles.text} text90 color={Colors.dark40} numberOfLines={1}>{item.location}</Text>
                            <Text>
                                {between(item.status_id, 1,4) ? (
                                    <Chip
                                        label={moment(item.created_at).format('Y-MMM-D')}
                                        labelStyle={{color: Colors.white}}
                                        containerStyle={{borderColor: Colors.dark70, backgroundColor: Colors.yellow20, marginLeft: Spacings.s1}}
                                    />
                                ) : between(item.status_id, 9, 10) ? (
                                    <Chip
                                        label={moment(item.created_at).format('Y-MMM-D')}
                                        labelStyle={{color: Colors.white}}
                                        containerStyle={{borderColor: Colors.dark70, backgroundColor: Colors.green20, marginLeft: Spacings.s1}}
                                    />
                                ) : (
                                    <Chip
                                        label={moment(item.created_at).format('Y-MMM-D')}
                                        labelStyle={{color: Colors.white}}
                                        containerStyle={{borderColor: Colors.dark70, backgroundColor: Colors.blue20, marginLeft: Spacings.s1}}
                                    />
                                )}
                            </Text>
                        </ListItem.Part>
                    </ListItem.Part>
                </ListItem>
            </Drawer>
        </AnimatableView>
    )
}

export default OrderItem

