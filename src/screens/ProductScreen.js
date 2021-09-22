import _ from 'lodash';
import React, { useEffect, useCallback, useRef, useState } from 'react';
import {FlatList, Dimensions, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Card, Text, Image, ListItem, Chip, Colors, Spacings, View, ExpandableSection, Switch} from 'react-native-ui-lib';
import { useFocusEffect } from '@react-navigation/native';
import 'intl';
import 'intl/locale-data/jsonp/en';

import { getProductList, getMoreProduct } from '../redux/actions/misc.action';
import Loader from '../components/Loader';
import EmptyList from '../components/EmptyList';

const ProductScreen = ({navigation}) => {
    const dispatch = useDispatch();
    const {loading, products, error} = useSelector(state => state.productReducer)
    const [expanded, setExpanded] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(null)
    const isMounted = useRef(false);

    const _loadData = async () => await dispatch(getProductList());
    const _loadMoreProdut = async () => await dispatch(getMoreProduct());

    const numberFormatter = (number) => {
        return new Intl.NumberFormat('en-US').format(number)
    }

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            isMounted.current = true;
            dispatch({
                type: 'PRODUCT_RESET'
            })
            _loadData()

            return () => {
                isActive = false;
                isMounted.current = false;
            };
        }, [])
    );

    const setHeaderSection = (name, uom, qty) => {
        return (
            <Card borderRadius={0} centerV height={45} marginH-s1 marginB-s1 padding-s1>
                <Text capitalize>{name}</Text>
                <View flex spread row>
                    <Text dark40 text100 flexwrap>Default UoM: {uom.uom_unit}</Text>
                    <Text dark40 text100 flexwrap>Default QTY: {qty}</Text>
                </View>
            </Card>
        )
    }

    const getBodyElement = (item) => {

        const stockCount = () => {
            let stock = 0;
            item.inventory_location.forEach(v => {
                stock += Number(v.stock_available)
            });

            return stock.toPrecision(7);
        }
        return (
            <Card marginB-s1 style={{marginTop: -10}} marginH-s1 borderRadius={0} padding-s1>
                <View spread row>
                    <View flex-3>
                        <View spread col>
                            <Text uppercase dark20 text90>Price Type</Text>
                            <View borderTopWidth={1}>
                                {_.map(item.price_level, (type, index) => {
                                    return (
                                        <Card paddingH-s1 borderRadius={0} bg-dark60 paddingV-s1 spread row key={index}>
                                            <Text uppercase text100>{type.price_type.name}</Text>
                                            <Text>{'\u20A6'}{numberFormatter(type.price)}</Text>
                                        </Card>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                    <View flex-3>
                        <View spread col>
                            <Text uppercase dark20 text90 center>UoM</Text>
                            <View borderTopWidth={1}>
                                {item.product_uoms.length === 0 ? (
                                    <Card paddingH-s1 borderRadius={0} bg-dark60 center centerV marginTop={20}>
                                        <Text uppercase>UoM Not Set</Text>
                                    </Card>
                                ) : (
                                    _.map(item.product_uoms, (type, index) => {
                                        return (
                                            <Card paddingH-s1 borderRadius={0} bg-dark60 paddingV-s1 spread row key={index}>
                                                <Text uppercase text100>{type.uom.uom_unit}</Text>
                                                <Text>{'\u20A6'}{numberFormatter(type.uprice)}</Text>
                                            </Card>
                                        )
                                    })
                                )}
                            </View>
                        </View>
                    </View>
                </View>
                <Card borderRadius={1} border={1} marginT-s1 spread row padding-s1>
                    <View centerV>
                        <Text uppercase text90>Stock: {stockCount() ? stockCount() : 0} {item.uom.uom_unit}</Text>
                    </View>
                    <Chip
                        label="Update Prices"
                        labelStyle={{color: Colors.white}}
                        containerStyle={{borderColor: Colors.dark70, backgroundColor: Colors.dark20, marginLeft: Spacings.s1}}
                        onPress={() => navigation.navigate('ProductUpdate', {product: item})}
                    />
                </Card>
            </Card>
        );
    }

    const renderItem = ({item, index}) => {
        return (
            <ExpandableSection
                top={false}
                expanded={index === selectedIndex ? true : false}
                sectionHeader={setHeaderSection(item.item_name, item.uom, item.default_qty)}
                onPress={() => setSelectedIndex(index)}
                key={index}
            >
                {getBodyElement(item)}
            </ExpandableSection>
        )
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
            data={products}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={<EmptyList />}
            onEndReached={_loadMoreProdut}
            onEndReachedThreshold={0.5}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={() => {
                        dispatch({type: 'PRODUCT_RESET'})
                        _loadData()
                    }}
                />
            }
        />
    )
}

export default ProductScreen
