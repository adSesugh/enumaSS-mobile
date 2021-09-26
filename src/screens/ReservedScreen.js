import React, { useEffect, useCallback, useRef } from 'react';
import {Alert, FlatList, Dimensions, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { getReservedOrders } from '../redux/actions/misc.action';
import Loader from '../components/Loader';
import EmptyList from '../components/EmptyList';
import ItemList from '../components/ItemList';
import {View, Text} from 'react-native-ui-lib';
import { useFocusEffect } from '@react-navigation/native';

const ReservedScreen = () => {
    const dispatch = useDispatch();
    const { loading, reserved, error} = useSelector(state => state.reservedReducer)
    const isMounted = useRef(false);

    const _loadData = async () => await dispatch(getReservedOrders());

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
            path='OrderDetail'   
            index={index} 
        />
    }

    const keyExtractor = (item, index) => `${item.id}-${index}`;

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <FlatList
                data={reserved}
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

export default ReservedScreen
