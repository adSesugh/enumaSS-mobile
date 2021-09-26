import React, { useEffect, useCallback, useRef } from 'react';
import {Alert, FlatList, Dimensions, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text} from 'react-native-ui-lib';
import { useFocusEffect } from '@react-navigation/native';

import { getPickups } from '../redux/actions/misc.action';
import Loader from '../components/Loader';
import EmptyList from '../components/EmptyList';
import ItemList from '../components/ItemList';

const PickupScreen = () => {
    const dispatch = useDispatch();
    const {loading, pickups, error} = useSelector(state => state.pickupReducer)
    const isMounted = useRef(false);

    const _loadData = async () => await dispatch(getPickups());

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
        return <ItemList 
            id={item.id} 
            name={item.client.person}
            location={item.location.store_name}
            amount={item.total}
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
        <>
            <FlatList
                data={pickups}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ListEmptyComponent={<EmptyList />}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={() => _loadData()}
                    />
                }
            />
            {error && Alert.alert('Oops! Error', error, [
                    {
                        text: "TRY AGAIN", onPress: () => dispatch({type: 'RESET_ERROR'})
                    },
                    { text: "CHANGE SERVER", onPress: () => dispatch({type: 'RESET_LOGIN'}) }
                ])
            }
        </>
    )
}

export default PickupScreen
