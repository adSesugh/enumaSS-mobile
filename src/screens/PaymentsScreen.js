import React, { useEffect, useCallback, useRef } from 'react';
import {FlatList, Dimensions, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text} from 'react-native-ui-lib';
import { useFocusEffect } from '@react-navigation/native';

import { getPayments } from '../redux/actions/misc.action';
import Loader from '../components/Loader';
import EmptyList from '../components/EmptyList';
import ItemList from '../components/ItemList';
import ListHeader from '../components/ListHeader';

const PaymentsScreen = () => {
    const dispatch = useDispatch();
    const {loading, payments, error} = useSelector(state => state.paymentsReducer)
    const isMounted = useRef(false);
    console.log(payments)

    const _loadData = async () => await dispatch(getPayments());

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            isMounted.current = true;
            
            _loadData()

            return () => {
                isActive = false;
                isMounted.current = false;
            };
        }, [])
    );

    const total = () => {
        let sum = 0;
        if(payments.length){
            payments.forEach(el => {
                sum += Number(el.amount_received)
            });
        }

        return sum;
    }

    const renderItem = ({item, index}) => {
        return <ItemList 
            id={item.id} 
            name={item.client.person}
            location={item.location.store_name}
            amount={item.amount_received}
            createdAt={item.created_at}
            onPress={() => navigation.push('OrderDetails', {orderId: item.id})}   
            index={index} 
        />
    }

    const keyExtractor = (item, index) => `${item.id}-${index}`;

    if (loading) {
        return <Loader />
    }

    if (error) {
        return (
            <View flex center>
                <Text>{error}!</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={payments}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={<EmptyList />}
            ListHeaderComponent={() => {
                return (
                    <ListHeader total={total()} label='Monthly Total' />
                )
            }}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={() => _loadData()}
                />
            }
        />
    )
}

export default PaymentsScreen
