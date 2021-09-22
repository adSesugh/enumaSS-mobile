import React, { useEffect, useCallback, useRef } from 'react';
import {FlatList, Dimensions, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text} from 'react-native-ui-lib';
import { useFocusEffect } from '@react-navigation/native';

import { getReceivables } from '../redux/actions/misc.action';
import Loader from '../components/Loader';
import EmptyList from '../components/EmptyList';
import ItemList from '../components/ItemList';
import ListHeader from '../components/ListHeader';


const ReceivableScreen = () => {
    const dispatch = useDispatch();
    const {loading, receivables, error} = useSelector(state => state.receivableReducer)
    const isMounted = useRef(false);

    const _loadData = async () => await dispatch(getReceivables());

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
        receivables.forEach(el => {
            const rowTotal = el.total - el.amount_paid
            sum += rowTotal
        });

        return sum;
    }

    const renderItem = ({item, index}) => {
        const amount = item.total - item.amount_paid;

        return <ItemList id={item.id} 
            name={item.client.person}
            location={item.location.store_name}
            amount={amount}
            createdAt={item.created_at}
            onPress={() => navigation.push('OrderDetails', {orderId: item.id})}   
            index={index} 
        />
    }

    const keyExtractor = (item, index) => `${item.id}-${index}`;

    if (loading) {
        return <Loader />
    }

    return (
        <FlatList
            data={receivables}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={<EmptyList />}
            ListHeaderComponent={() => {
                return (
                    <ListHeader total={total()} label='Total Receivables' />
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

export default ReceivableScreen
