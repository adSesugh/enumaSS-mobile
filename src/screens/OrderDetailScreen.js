import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import { ScrollView, FlatList, ToastAndroid, Alert } from 'react-native';
import moment from 'moment';
import { Button, Card, View, Text} from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
//import axios from '../redux/api'
import axios from 'axios';


import { getOrderDetails } from '../redux/actions/order.action';
import EmptyList from '../components/EmptyList';
import Loader from '../components/Loader';

const OrderDetailScreen = ({navigation, route}) => {
    const {orderId} = route.params;
    const dispatch = useDispatch();
    const {token, baseURL} = useSelector(state => state.loginReducer)
    const [disabled, setDisabled] = useState(false)

    const {details, loading, error } = useSelector(state => state.orderDetailReducer);

    const orderDetails = async () => await dispatch(getOrderDetails(orderId));

    useEffect(() => {
        navigation.setOptions({ title: `Sales Order #${orderId}`})
        orderDetails()
    }, [orderId]);

    const lineTotal = (qty, price) => qty * price;

    const numberFormatter = (number) => {
        return new Intl.NumberFormat('en-US').format(number)
    };

    const _invoiceOrder = async (orderId) => {
        await axios
          .get(`${baseURL}/invoice/store/${orderId}`, {
              headers: {
                  Authorization: `Bearer ${token}`,
                  timeout: 10000
              }
          })
          .then(res => {
                if(res.status === 200) {
                    ToastAndroid.show("Order Invoiced successfully!", ToastAndroid.SHORT);
                }
          })
          .catch(err => console.error(err));
    }

    if(loading) {
        return <Loader />
    }

    return (
        <View bg-dark40 marginB-s10>
            <Card borderTopWidth={2} borderRadius={8} paddingV-s2 margin-s1>
                <View spread horizontal row marginH-s1>
                    <View flexwrap flex-3>
                        <Text text70 uppercase underline>Bill To:</Text>
                        <Text dark20 text90>{details?.client.text}</Text>
                        {details?.client.billing_address && (<Text dark40 text100>{details?.client.billing_address}</Text>)}
                        {details?.client.mobile_number && (<Text dark40 text80>{details?.client.mobile_number}</Text>)}
                        {details?.client.due_balance !== 0 && <Text bg-red10 borderRadius={3} white uppercase text90 center>Due Balance: {'\u20A6'}{numberFormatter(details?.client.due_balance)}</Text>}
                    </View>
                    <View flexwrap flex-3 right marginT-s2>
                        <Text uppercase text90>{details?.location.store_name} Store</Text>
                        <Text uppercase text100>Order: #{details?.number}</Text>
                        <Text uppercase text100>Date: {moment(details?.created_at).format('Do MMM, Y')}</Text>
                        <Text marginT-s4 uppercase text100>By: {details?.user.name}</Text>
                    </View>
                </View>
            </Card>
            <Card borderRadius={8} margin-s1>
                <View margin-s2>
                    <Text uppercase text60 center>Order Items</Text>
                </View>
                <View spread horizontal row borderWidth={0.5} paddingH-s1>
                    <View flex-4 borderRightWidth={0.5}><Text marginV-s1 text80 uppercase style={{fontWeight: 'bold'}}>Item Description</Text></View>
                    <View flex-2 centerV right><Text text80 uppercase style={{fontWeight: 'bold', alignItems: 'flex-end'}}>SubTotal</Text></View>
                </View>
                <ScrollView height="64%" showsVerticalScrollIndicator={false}>
                    {_.map(details?.items, (item, index) => (
                        <View borderWidth={0.5} spread row horizontal key={index} paddingH-s1>
                            <View flex-4 borderRightWidth={0.5}>
                                <Text text90>{item.product.item_name}</Text>
                                <Text text100 dark40>{item.qty} {item.uom.text} X {item.unit_price}</Text>
                            </View>
                            <View flex-2 right centerV>
                                <Text center>{lineTotal(item.qty, item.unit_price)}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </Card>
            <Card baseline borderRadius={0}>
                <View spread horizontal row borderWidth={1} paddingH-s1>
                    <View flex-4 borderRightWidth={0.5} paddingR-s1 right><Text marginV-s1 text80 uppercase style={{fontWeight: 'bold'}}>Total:</Text></View>
                    <View flex-2 right centerV><Text text80 uppercase style={{fontWeight: 'bold'}}>{'\u20A6'}{numberFormatter(details?.total)}</Text></View>
                </View>
            </Card>
            <Card baseline borderRadius={0}>
                <View spread horizontal row paddingH-s1 center>
                    <View flex-3>
                        <Button onPress={() => Alert.alert('Confirm Action', 'Are you sure to convert order to invoice?', [
                            {
                                text: "CANCEL",
                            },
                            { text: "YES", onPress: () => _invoiceOrder(details?.id) }
                        ]) } disabled={details?.status_id === 3 ? false : disabled ? true : true} size={Button.sizes.small} label="INVOICE"></Button>
                    </View>
                    <View flex-3 centerV paddingV-s1>
                        <Button onPress={() => Alert.alert('Confirm Action', 'Are you sure make payment for this order?', [
                            {
                                text: "CANCEL",
                            },
                            { text: "YES", onPress: () => navigation.navigate('Payment', {orderId: details?.id}) }
                        ]) } disabled={(details?.status_id === 8 || details?.status_id === 10) ? false : disabled ? true : true} size={Button.sizes.small} label="PAY"></Button>
                    </View>
                </View>
            </Card>
        </View>
    )
}

export default OrderDetailScreen
