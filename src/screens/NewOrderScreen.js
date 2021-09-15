import _ from 'lodash'
import 'intl'
import 'intl/locale-data/jsonp/en'
import React, { useEffect, useState, createRef } from 'react'
import {ScrollView, Image, ActivityIndicator, FlatList, TextInput, Alert} from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import {Ionicons, AntDesign, Entypo} from '@expo/vector-icons'
import { useForm, Controller } from 'react-hook-form'
import {
    View, 
    Button, 
    Card, 
    Colors, 
    Constants, 
    Dialog, 
    Drawer, 
    Text,
    Toast, 
    Picker, 
    TextField
} from 'react-native-ui-lib'
import { useDispatch, useSelector } from 'react-redux'
import { postClient, postOrder } from '../redux/actions/order.action'
import Loader from '../components/Loader'
import CartItem from '../components/CartItem';
import ToastMsg from '../components/ToastMsg';

import axios from '../redux/api'

const actionSheetRef = createRef()
const checkIcon = require('../../assets/icons/checkmark.png')

const NewOrderScreen = ({navigation}) => {
    const [show, setShow] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [hideDialog, setHideDialog] = useState(false)
    const [form, setForm] = useState(null)
    const [client, setClient] = useState(null)
    const [dueBalance, setDueBalance] = useState(0.00)
    const [personType, setPersonType] = useState(false)
    const [creditWorthy, setCreditWorthy] = useState(false)
    const [product, setProduct] = useState(null)
    const [uoms, setUoms] = useState(null)
    const [uom, setUom] = useState(null)
    const [qty, setQty] = useState(1)
    const [unitPrice, setUnitPrice] = useState(0.00)
    const [priceType, setPriceType] = useState(1)
    const [cart, setCart] = useState([])
    const [message, setMessage] = useState(null)
    const [spinner, setSpinner] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [xdisabled, setXDisabled] = useState(false)
    const { control, handleSubmit, reset, formState: { errors, isDirty, isValid } } = useForm()
    const { loading, msg, error } = useSelector(state => state.orderReducer)
    const {token} = useSelector(state => state.loginReducer)
    const dispatch = useDispatch()

     useEffect(() => {
        formState()
    }, [uoms, uom, unitPrice, priceType, product, cart, message])

    const formState = async () => { 
        await axios.get("/makeOrder", {
              headers: {
                  Authorization: "Bearer "+token
              }
          })
          .then(res => {
                if(res.data && res.status === 200) {
                    setForm(res.data.form)
                }
                else {
                    console.log("Error")
                }
          })
          .catch(err => console.error(err));
    }

    const getClient = async (item) => {
        const clientId = item.value
        return await axios.get("/clientDetails?client_id="+clientId, {
              headers: {
                  Authorization: "Bearer "+token
              }
          })
          .then(res => {
            if(res.status === 200 && res.data !== undefined){
                if(res.data.results !== null){
                    const balance = res.data.results.due_balance + res.data.results.amount_due
                    setDueBalance(balance)
                    setPersonType(res.data.results.person_type)
                    setCreditWorthy(res.data.results.credit_worthy)
                }
                else {
                    setDueBalance(0.00)
                    setPersonType(false)
                    setCreditWorthy(false)
                }
            }   
          })
          .catch(err => console.error(err));
    }

    const getUoms = async (item) => {
        setUoms(null)
        setUom(null)
        setUnitPrice(0)
        const productId = item.value
        return await axios.get("/productUom?product_id="+productId, {
              headers: {
                  Authorization: "Bearer "+token
              }
          })
          .then(res => {
              setUoms(res.data.results)
              setDisabled(false)
          })
          .catch(err => console.error(err));
    }

    const getPrice = async (item) => {   
        setUnitPrice(0)
        const productId = product.value
        const uomId = item.value
        const priceTypeId = priceType?.value ? priceType?.value : 1

        await axios.get(`/itemPrice?product_id=${productId}&uom_id=${uomId}&priceType_id=${priceTypeId}`, {
              headers: {
                  Authorization: "Bearer "+token
              }
          })
          .then(res => {
              if(res.data.price !== 0) {
                  setUnitPrice(res.data.price)
              }
          })
          .catch(err => console.error(err));
    }

    const totalSum = () => {
        let sum = 0
        cart.forEach(el => {
            sum += el.qty * el.unit_price
        })
        return sum
    }

    const numberFormatter = (number) => {
        return new Intl.NumberFormat('en-US').format(number)
    }

    const nFormatter = (number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(number)
    }

    const _removeFromCart = productId => {
        const newCart = cart.filter(x => x.product_id !== productId);
        setCart(newCart);
    }

    const addToCart = async () => {
        setSpinner(true);
        await axios
          .get(`/qtyCheck?product_id=${product?.value}&uom_id=${uom?.value}&qty=${qty}`, {
               headers: {
                    Authorization: "Bearer "+token
              }
          })
          .then((res) => {
                dispatch({type: 'QTY_CHECK'})
                if(res.data.result === 0 || res.data.result < 1) { 
                    if(res.data?.message !== '') {
                        setMessage(res.data?.message)
                        setOpenDialog(true)
                        setSpinner(false)
                    }
                } else {
                    setCart([...cart, {
                        product_id: product?.value,
                        item_name: product?.label,
                        unit_price: unitPrice !== undefined ? unitPrice : 0,
                        uom_id: uom?.value,
                        uom_name: uom?.label,
                        qty: qty
                    }]);

                    setProduct(null)
                    setUnitPrice(0)
                    setUom(null)
                    setUoms(null)
                    setQty(1)
                    setSpinner(false)
                }
          })
          .catch(err => console.error(err));
    }

    const onSubmitClient = async (data) => {
        await dispatch(postClient(data))
        reset()
        console.log(reset())
        actionSheetRef.current?.hide()
        setOpenDialog(true)
    }

    const onSubmit = async (type) => {
        setDisabled(true)
        setXDisabled(true)

        let formData = new FormData()
        formData.append('client_id', client?.value)
        formData.append('priceType_id', priceType?.value)
        formData.append('date', form.date)
        formData.append('number', form.number)
        formData.append('status_id', 3)
        formData.append('currency_id', 78)
        formData.append('due_balance', form.due_balance)
        
        formData.append('items', JSON.stringify(cart))
        if(type === 'invoiced'){
            formData.append('actionType', 1)
        }else {
            formData.append('actionType', 0)
        }

        const orderTotal = totalSum();

        await axios
          .get(`/orderEligibility?client_id=${client?.value}&orderTotal=${orderTotal}`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          })
          .then(res => {
              if(res.status === 200 && res.data.results){
                    dispatch(postOrder(formData))
                    setClient(null)
                    setCart([])
                    setDisabled(false)
                    setXDisabled(false)

                    navigation.navigate('Orders');
              }
              else {
                  setMessage(res.data.message)
                  setOpenDialog(true)
                  setDisabled(false)
                  setXDisabled(false)
              }
          })
          .catch(err => console.error(err));
    }

    return (
        <>
            {loading ? <Loader/> : (
                <View flex bg-dark80>
                    <Card spread row horizontal borderRadius={10} marginH-s1 marginT-s1 style={{ backgroundColor: Colors.green80}}>
                        <View flex paddingH-s2>
                            <Picker
                                placeholder="Pick a Client"
                                floatingPlaceholder
                                value={client}
                                enableModalBlur={false}
                                onChange={item => {
                                    setClient(item)
                                    setCart([])
                                    getClient(item)
                                }}
                                topBarProps={{title: 'Client Search'}}
                                style={{color: Colors.red20}}
                                showSearch
                                searchPlaceholder={'Search a client'}
                                searchStyle={{color: Colors.blue30, placeholderTextColor: Colors.dark50}}
                                //onSearchChange={value => clientSearch(value)}
                            >
                                {_.map(form?.clients, (option, index) => (
                                    <Picker.Item key={index} value={index} label={option} />
                                ))}
                            </Picker>
                        </View>
                        <View center paddingR-s2>
                            <Button label="+" body bg-green30 round onPress={() => actionSheetRef.current?.setModalVisible()}></Button>
                            <ActionSheet ref={actionSheetRef} closeOnTouchBackdrop={false}>
                                {loading ? (<View height={200}><Loader /></View>) : (
                                    <View paddingT-s2>
                                        <Card margin={10} borderRadius={20}>
                                            <View style={{borderBottomWidth: 0.5, height: 45, alignItems: 'center', justifyContent: 'center'}}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase'}}>Quick Client Add</Text>
                                            </View>
                                            <View center>
                                                <Controller
                                                    control={control}
                                                    rules={{
                                                        required: true,
                                                    }}
                                                    render={({ field: { onChange, onBlur, value } }) => (
                                                        <TextInput
                                                            style={{borderWidth: 0.5, height: 45, width: '90%', borderRadius: 10, margin: 10, paddingLeft: 10 }}
                                                            placeholder="Client Name"
                                                            onBlur={onBlur}
                                                            onChangeText={onChange}
                                                            value={value}
                                                        />
                                                    )}
                                                    name="person"
                                                    defaultValue=""
                                                />
                                                <Controller
                                                    control={control}
                                                    rules={{
                                                        required: true,
                                                    }}
                                                    render={({ field: { onChange, onBlur, value } }) => (
                                                        <TextInput
                                                            style={{borderWidth: 0.5, height: 45, width: '90%', borderRadius: 10, margin: 10, paddingLeft: 10 }}
                                                            placeholder="Mobile Number"
                                                            onBlur={onBlur}
                                                            onChangeText={onChange}
                                                            value={value}
                                                            keyboardType="numeric"
                                                        />
                                                    )}
                                                    name="mobile_number"
                                                    defaultValue=""
                                                />
                                                <Button disabled={!isDirty} style={{margin: 10, width: 220, color: 'white', height: 40, borderRadius: 10, backgroundColor: Colors.green30 }} onPress={handleSubmit(onSubmitClient)} label="Save Client" iconOnRight={<AntDesign name="login" color="white" size="20" />} />
                                            </View>
                                        </Card>
                                    </View>
                                )}
                            </ActionSheet>
                        </View>
                    </Card>
                    <Card borderRadius={10} paddingH-s2 paddingB-s2 marginB-4 marginH-s1 marginT-s1 style={{ backgroundColor: Colors.green70}}>
                        <View row>
                            <View flex-3 paddingV-s2>
                                <Text red20 bold>DUE BALANCE: {dueBalance}</Text>
                            </View>
                            <View flex-3 paddingV-s0>
                                <Picker
                                    placeholder="Client Type"
                                    value={priceType}
                                    onChange={items => {
                                        setPriceType(items)
                                        setProduct(null)
                                        setUom(null)
                                        setQty(1)
                                        setUnitPrice(0)
                                        setDisabled(false)
                                    }}
                                >
                                    {_.map(form?.priceTypes, (option, index) => (
                                        <Picker.Item key={index}  value={option.value} label={option.label} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                        <View row>
                            <Text flex-3 dark20 bold>ORDER: {form?.number}</Text>
                            <Text flex-3 orange30 bold>DATE: {form?.date}</Text>
                        </View>
                    </Card>
                    {spinner ? (
                        <View center height={30}>
                            <ActivityIndicator size="small" color={Colors.green20} />
                        </View>
                    ) : (
                        <Card borderRadius={10} marginH-s1 style={{ backgroundColor: Colors.dark50}}>
                            <View row paddingH-s2>
                                <Text uppercase dark10 bold white>Product Search</Text>
                            </View>
                            <View col>
                                <Picker
                                    paddingH-s2
                                    placeholder="Select a product"
                                    value={product}
                                    onChange={item => {
                                        setProduct(item)
                                        setQty(1)
                                        getUoms(item)

                                    }}
                                    topBarProps={{title: 'Product Search'}}
                                    style={{color: Colors.dark80}}
                                    showSearch
                                    searchPlaceholder={'Search for product'}
                                    searchStyle={{color: Colors.blue30, placeholderTextColor: Colors.dark50}}
                                >
                                    {_.map(form?.products, (option, i) => (
                                        <Picker.Item key={i} value={i} label={option} disabled={disabled}/>
                                    ))}
                                </Picker>
                                <View row spread horizontal paddingH-s2>
                                    <View flex-5>
                                        <Picker
                                            placeholder="Pick a UoM"
                                            value={uom}
                                            onChange={item => {
                                                setUom(item)
                                                getPrice(item)
                                            }}
                                            topBarProps={{title: 'Select UoM'}}
                                            style={{color: Colors.dark80}}
                                            searchStyle={{color: Colors.blue30, placeholderTextColor: Colors.dark50}}
                                        >
                                            {_.map(uoms, (option, index) => (
                                                <Picker.Item key={index} value={option.id} label={option.text} disabled={disabled}/>
                                            ))}
                                        </Picker>
                                    </View>
                                    <View flex paddingH-s4>
                                        <View row center>
                                            <Button 
                                                disabled={qty <= 1 ? true : false} 
                                                size={Button.sizes.xSmall} 
                                                outline 
                                                round
                                                center
                                                white
                                                borderRadius={0}
                                                onPress={() => setQty(Number(qty)-1)} 
                                                label="-">
                                            </Button>
                                                <TextInput
                                                    style={{ width: 35, height: 25, backgroundColor: 'white' }} 
                                                    onChangeText={(e) => setQty(e)}
                                                    defaultValue={qty.toString()}
                                                    textAlign="center"
                                                    keyboardType="numeric"
                                                />
                                            <Button 
                                                size={Button.sizes.xSmall} 
                                                borderRadius={0} 
                                                round
                                                outline
                                                white 
                                                center
                                                label="+" 
                                                onPress={() => {
                                                    const next = Number(qty) + 1
                                                    setQty(next)
                                                }}>
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                                <View row spread horizontal paddingH-s2 paddingB-s1>
                                    <View flex-4><Text white>Unit Price: {unitPrice}</Text></View>
                                    <View flex-1 center paddingR-s2>
                                        {unitPrice !==0 && <Button onPress={addToCart} label="Add" body bg-green20 size={Button.sizes.xSmall}></Button>}
                                    </View>
                                </View>
                            </View>
                        </Card>
                    )}
                    <Card borderRadius={0} marginT-s1>
                        <View spread row padding-s2 borderWidth={1}>
                            <View row center>
                                {xdisabled ? <ActivityIndicator size="small" color={Colors.green20} /> : (
                                    <>
                                        {Object.keys(cart).length !==0 && <Button disabled={xdisabled ? true: false} onPress={() => onSubmit('checkout')} size={Button.sizes.small} label="Checkout"></Button>}

                                        {Object.keys(cart).length !==0 && <Button disabled={xdisabled ? true: false} onPress={() => onSubmit('invoiced')} size={Button.sizes.small} label="Invoiced"></Button>}
                                    </>
                                )}
                            </View>
                            <View center>
                                <Text text90 dark10 style={{fontSize: 14}}>Total: { nFormatter(totalSum()) }</Text>
                            </View>
                        </View>
                        <View spread row padding-s2 borderWidth={0.4}>
                            <View borderRightWidth={0.5} flex-4>
                                <Text h3>Item Description</Text>
                            </View>
                            <View flex-2 style={{alignItems: 'flex-end'}}>
                                <Text>Sub Total</Text>
                            </View>
                        </View>
                    </Card>
                    <ScrollView height="60%" showsVerticalScrollIndicator={false}>
                        {_.map(cart, (item, index) => (
                            <CartItem item={item} key={index} _removeFromCart={_removeFromCart} numberFormatter={numberFormatter} />
                        ))}
                    </ScrollView>
                    <ToastMsg openDialog={openDialog} msg={msg} message={message} setOpenDialog={setOpenDialog} />
                </View>
            )}
        </>
    )
}

export default NewOrderScreen
