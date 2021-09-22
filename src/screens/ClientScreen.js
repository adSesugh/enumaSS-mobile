import React, { useEffect, useCallback, useRef } from 'react';
import {FlatList, Dimensions, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { Colors, View, Text} from 'react-native-ui-lib';
import { useFocusEffect } from '@react-navigation/native';
import 'intl';
import 'intl/locale-data/jsonp/en';

import { getClientList, getMoreClient } from '../redux/actions/misc.action';
import Loader from '../components/Loader';
import EmptyList from '../components/EmptyList';
import ItemList from '../components/ItemList';

const ClientScreen = () => {
    const dispatch = useDispatch();
    const {loading, customers, error} = useSelector(state => state.customersReducer)
    const isMounted = useRef(false);

    const _loadData = async () => await dispatch(getClientList());
    const _loadMoreClient = async () => await dispatch(getMoreClient());

    const numberFormatter = (number) => {
        return new Intl.NumberFormat('en-US').format(number)
    }

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

    const renderItem = ({item, index}) => {
        let revenue = 0;
        let dueBalance = 0;
        if(!item.client_outstanding){
            //revenue = 0;
            dueBalance = 0;
        }
        else {
            item.client_outstanding.forEach(el => {
                if(!el.cleared) {
                    dueBalance += Number(el.amount_due)
                }
            });
        }

        if(!item.payments) {
            revenue = 0;
        }
        else {
            item.payments.forEach(ele => {
                revenue += Number(ele.amount_received)
            })
        }

        return <ItemList 
            id={item.id} 
            name={item.person}
            location={item.mobile_number}
            amount={revenue}
            others={`Due ${new Intl.NumberFormat('en-US').format(dueBalance)}`}
            color={Colors.red40}
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
            data={customers}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={<EmptyList />}
            onEndReached={_loadMoreClient}
            onEndReachedThreshold={0.5}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={() => {
                        _loadData()
                    }}
                />
            }
        />
    )
}

export default ClientScreen
