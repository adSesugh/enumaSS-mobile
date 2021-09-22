import _ from 'lodash';
import React, {useEffect, useState} from 'react'
import {ScrollView, TextInput, ActivityIndicator, ToastAndroid} from 'react-native'
import {
    View, 
    Button, 
    Card, 
    Chip,
    Colors, 
    Constants, 
    Dialog, 
    Drawer, 
    Text,
    Toast, 
    Picker, 
    Spacings
} from 'react-native-ui-lib'
import { useNavigation } from '@react-navigation/native';
import 'intl';
import 'intl/locale-data/jsonp/en';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'

const starIcon = require('../../assets/icons/delete.png')

const ProductUpdateScreen = ({navigation, route}) => {
    const {product} = route.params;
    const [form, setForm] = useState(null);
    const [uoms, setUoms] = useState(null);
    const [uom, setUom] = useState(null);
    const [qty, setQty] = useState(0);
    const [uprice, setUprice] = useState(0);
    const [xdisabled, setXDisabled] = useState(false)
    const [uomPrices, setUomPrices] = useState([]);
    const {token, baseURL} = useSelector(state => state.loginReducer)

    const [regular, setRegular] = useState(0);
    const [bulk, setBulk] = useState(0);
    const [reseller, setReseller] = useState(0);


    const numberFormatter = (number) => {
        return new Intl.NumberFormat('en-US').format(number)
    }

    const stockCount = () => {
        let stock = 0;
        product.inventory_location.forEach(v => {
            stock += Number(v.stock_available)
        });

        return stock.toPrecision(7);
    }

    const _removeFromCart = uomId => {
        const newCart = uomPrices.filter(x => x.uom_id !== uomId);
        setUomPrices(newCart);
    }

    useEffect(() => {
        navigation.setOptions({ title: `${product.item_code}`})
        pullUom()

        product.price_level.forEach(el => {
            if(el.priceType_id === 1) {
                setRegular(el.price)
            }
            else if(el.priceType_id === 2) {
                setBulk(el.price)
            }
            else if(el.priceType_id === 3) {
                setReseller(el.price)
            }
        });
    }, [product]);

    const pullUom = async () => {
        await axios
            .get(`${baseURL}/uomList`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                timeout: 10000
            })
            .then(res => {
                if(res.data && res.status === 200) {
                    setUoms(res.data)
                }
            })
            .catch(err => console.error(err));
    }

    const addToCart = async () => {
         const data = {
            product_id: product.id,
            uom_id: uom?.value,
            name: uom?.label,
            qty_calc: qty,
            uprice: uprice !== undefined ? uprice : 0
        }

        setXDisabled(true)

        await axios
          .post(`${baseURL}/uomList`, data, {
              headers: {
                  Authorization: `Bearer ${token}`
              },
              timeout: 10000
          })
          .then(res => {
                if(res.data && res.data.result) {
                    setXDisabled(false)
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
                    setUomPrices([...uomPrices, {
                        uom_id: uom?.value,
                        name: uom?.label,
                        qty_calc: qty,
                        uprice: uprice !== undefined ? uprice : 0,
                    }]);
                }
                else {
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
                    setXDisabled(false)
                    setUomPrices([...uomPrices, {
                        uom_id: uom?.value,
                        name: uom?.label,
                        qty_calc: qty,
                        uprice: uprice !== undefined ? uprice : 0,
                    }]);
                }
          })
          .catch(err => console.log(err));

        setUprice(0)
        setUom(null)
        setQty(0)
    }

    const onChange = (level, value) => {
        const data = {
            'product_id': product.id,
            'priceType_id': level.type,
            'price': level.value
        }

        setForm(data)
    }

    const onSubmitPrice = async () => {
        await axios
          .post(`${baseURL}/storePriceLevel`, form, {
              headers: {
                  Authorization: `Bearer ${token}`
              },
              timeout: 10000
          })
          .then(res => {
                if(res.data && res.data.result) {
                    setForm(null)
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
                }
                else {
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
                }
          })
          .catch(err => console.error(err));
    }

    return (
        <View flex>
            <Card borderRadius={0} marginH-s1>
                <View center centerV padding-s1>
                    <Text uppercase text90>{product.item_name}</Text>
                </View>
                <View spread row padding-s1>
                    <View right flex-3 paddingR-s5>
                        <Text dark40 text100 flexwrap>Default UoM: {product.uom.uom_unit}</Text>
                    </View>
                    <View flex-3>
                        <Text dark40 text100 flexwrap>Default QTY: {product.default_qty}</Text>
                    </View>
                </View>
                 <Card borderRadius={1} border={1} marginT-s1 spread row padding-s1>
                    <View centerV>
                        <Text uppercase text90>Stock: {stockCount() ? stockCount() : 0} {product.uom.uom_unit}</Text>
                    </View>
                    <Chip
                        label="Prices Updates"
                        labelStyle={{color: Colors.white}}
                        borderRadius={0}
                        containerStyle={{borderColor: Colors.dark70, backgroundColor: Colors.dark20, marginLeft: Spacings.s1}}
                    />
                </Card>
            </Card>
            <Card borderRadius={0} margin-s1 padding-s1>
                <ScrollView height="88%" showsVerticalScrollIndicator={false}>
                    <Card marginV-s2 borderRadius={0}>
                        <View spread row>
                            <View flex-3 padding-s1>
                                <View spread col>
                                    <Text uppercase dark20 text90>Price Type</Text>
                                    <View borderTopWidth={1}>
                                        <Card paddingH-s1 borderRadius={0} bg-dark60 spread paddingV-s1 row>
                                            <Text uppercase text100>Regular</Text>
                                            <Text>{'\u20A6'}{numberFormatter(regular)}</Text>
                                        </Card>
                                        <Card paddingH-s1 borderRadius={0} bg-dark60 spread paddingV-s1 row>
                                            <Text uppercase text100>Bulk</Text>
                                            <Text>{'\u20A6'}{numberFormatter(bulk)}</Text>
                                        </Card>
                                        <Card paddingH-s1 borderRadius={0} bg-dark60 spread paddingV-s1 row>
                                            <Text uppercase text100>Reseller</Text>
                                            <Text>{'\u20A6'}{numberFormatter(reseller)}</Text>
                                        </Card>
                                    </View>
                                </View>
                            </View>
                            <View flex-3 padding-s1>
                                <View spread col>
                                    <Text uppercase dark20 text90 center>UoM</Text>
                                    <View borderTopWidth={1}>
                                        {product.product_uoms.length === 0 ? (
                                            <Card paddingH-s1 borderRadius={0} bg-dark60 center centerV marginTop={20}>
                                                <Text uppercase>UoM Not Set</Text>
                                            </Card>
                                        ) : (
                                            _.map(product.product_uoms, (type, index) => {
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
                    </Card>
                    <View><Text uppercase text80>Price Type Modification</Text></View>
                    <Card padding-s2 spread col>
                        <View spread row margin-s1>
                            <View flex-2 centerV>
                                <Text text70 uppercase>Regular</Text>
                            </View>
                            <View flex-4>
                                <TextInput 
                                    style={{ height: 30, borderRadius: 5, padding: 4, borderWidth: 1, width: '100%' }} 
                                    onChangeText={(value) => {
                                        setRegular(value)
                                        onChange({type: 1, value: Number(value)})
                                    }}
                                    onBlur={() => onSubmitPrice()}
                                    textAlign="center"
                                    defaultValue={regular.toString()}
                                    keyboardType='numeric'
                                />
                            </View>
                        </View>
                        <View spread row margin-s1>
                            <View flex-2 centerV>
                                <Text text70 uppercase>Bulk</Text>
                            </View>
                            <View flex-4>
                                <TextInput 
                                    style={{ height: 30, borderRadius: 5, padding: 4, borderWidth: 1, width: '100%' }} 
                                    onChangeText={(value) => {
                                        setBulk(value)
                                        onChange({type: 2, value: Number(value)})
                                    }}
                                    onBlur={() => onSubmitPrice()}
                                    textAlign="center"
                                    defaultValue={bulk.toString()}
                                    keyboardType='numeric'
                                />
                            </View>
                        </View>
                        <View spread row margin-s1>
                            <View flex-2 centerV>
                                <Text text70 uppercase>Reseller</Text>
                            </View>
                            <View flex-4>
                                <TextInput 
                                    style={{ height: 30, borderRadius: 5, padding: 4, borderWidth: 1, width: '100%' }} 
                                    onChangeText={(value) => {
                                        setReseller(value)
                                        onChange({type: 3, value: Number(value)})
                                    }}
                                    onBlur={() => onSubmitPrice()}
                                    defaultValue={reseller.toString()}
                                    textAlign="center"
                                    keyboardType='numeric'
                                />
                            </View>
                        </View>
                    </Card>
                    <View marginT-s3><Text uppercase text80>Price By UoM Modification</Text></View>
                    <Card padding-s2 spread col marginB-s2>
                        <View spread col margin-s1>
                            <View flex-6 centerV>
                                <Picker
                                    paddingH-s2
                                    placeholder="Select a Unit of Measurement"
                                    value={uom}
                                    onChange={item => {
                                        setUom(item)

                                    }}
                                    topBarProps={{title: 'Unit of Measurement Search'}}
                                    style={{color: Colors.dark30, textTransform: 'uppercase'}}
                                    showSearch
                                    searchPlaceholder={'Search for Unit of Measurement'}
                                    searchStyle={{color: Colors.blue30, placeholderTextColor: Colors.dark50}}
                                >
                                    {_.map(uoms, (option, i) => (
                                        <Picker.Item key={i} value={i} label={option} />
                                    ))}
                                </Picker>
                            </View>
                            <View flex-6>
                                <View spread row>
                                    <View flex-4>
                                        <View spread row>
                                            <View flex-3>
                                                <View spread col>
                                                    <Text text100 uppercase>Qty Calc</Text>
                                                    <TextInput 
                                                        style={{ height: 30, borderRadius: 5, padding: 4, borderWidth: 1, width: '100%' }}
                                                        name="qty" 
                                                        onChangeText={(e) => setQty(e)}
                                                        defaultValue={qty.toString()}
                                                        textAlign="center"
                                                        keyboardType='numeric'
                                                    />
                                                </View>
                                            </View>
                                            <View flex-3 marginL-s1>
                                                <View spread col>
                                                    <Text text100 uppercase>Price</Text>
                                                    <TextInput 
                                                        style={{ height: 30, borderRadius: 5, padding: 4, borderWidth: 1, width: '100%' }}
                                                        name="uprice" 
                                                        onChangeText={(e) => setUprice(e)}
                                                        defaultValue={uprice.toString()}
                                                        textAlign="center"
                                                        keyboardType='numeric'
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View flex-2 paddingH-s1 centerV>
                                        <Text></Text>
                                        {xdisabled ? <ActivityIndicator size="small" color={Colors.green20} /> : (
                                                <>
                                                    <Button onPress={() => addToCart() } label="Add UoM" disabled={uprice > 0 ? false : true} size={Button.sizes.xSmall} outline borderRadius={0} />
                                                </>
                                            )
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View spread row margin-s1 borderWidth={0.4}>
                            <View borderRightWidth={0.5} flex-3 padding-s2>
                                <Text uppercase text90 padding-s2>UoM</Text>
                            </View>
                            <View flex-3 style={{alignItems: 'flex-end'}} padding-s2>
                                <Text uppercase text90>Price</Text>
                            </View>
                        </View>
                        <View margin-s1>
                            {Object.keys(uomPrices).length !== 0 ?
                                <>
                                    {_.map(uomPrices, (item, index) => (
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
                                                    <View borderRightWidth={0.5} flex-4 centerV>
                                                        <Text h4>{item.name}</Text>
                                                    </View>
                                                    <View flex-2 style={{alignItems: 'flex-end'}} centerV>
                                                        <Text>{'\u20A6'}{numberFormatter(item.uprice)}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </Drawer>
                                    ))}
                                </>
                            : (
                                <View flex center>
                                    <Text>No new UoM Added</Text>
                                </View>
                            )}
                        </View>
                    </Card>
                </ScrollView>
            </Card>
        </View>
    )
}

export default ProductUpdateScreen
