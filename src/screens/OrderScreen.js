import React, { useEffect, useCallback, useRef } from 'react';
import {Alert, FlatList, Dimensions, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { getOrders } from '../redux/actions/order.action';
import Loader from '../components/Loader';
import EmptyList from '../components/EmptyList';
import OrderItem from '../components/OrderItem';
import {View, Text} from 'react-native-ui-lib';
import { useFocusEffect } from '@react-navigation/native';

const OrderScreen = () => {
    const dispatch = useDispatch();
    const {loading, orders, error} = useSelector(state => state.orderReducer)
    const refArray = new Array();
    const isMounted = useRef(false);

    const _loadData = async () => await dispatch(getOrders());

    // useEffect(() => {
    //     _loadData()
    // }, [])

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

    const addRef = (ref, index) => {
        refArray[index] = ref;
    }

    const onEndReached = async () => {
        return await dispatch(getOrders());
    }

    const renderItem = ({item, index}) => {
        return <OrderItem item={item} index={index} addRef={addRef} />
    }

    const keyExtractor = (item, index) => `${item.id}-${index}`;

    if (Object.keys(orders).length === 0) {
        if (loading) {
            return <Loader />
        }

        if (error) {
            return (
                <View flex center>
                    <Text>Connectivity Issue!</Text>
                </View>
            )
        }
    }

    return (
        <>
            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                //onEndReached={onEndReached}
                //onEndReachedThreshold={0.5}
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

export default OrderScreen
