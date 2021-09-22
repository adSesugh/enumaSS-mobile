import _ from 'lodash';
import React, {useState, useEffect} from 'react';
import {Alert, Image, ToastAndroid, TextInput, ScrollView, TouchableOpacity} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import {Entypo, AntDesign, MaterialIcons } from '@expo/vector-icons'
import {Button, Card, Colors, DateTimePicker, View, Text, TextField} from 'react-native-ui-lib';
import {useSelector} from 'react-redux';
import * as ImagePicker from 'expo-image-picker';

//import axios from '../redux/api';
import axios from 'axios';


const paymentMode = [
    {label: 'CASH', value: 'cash'},
    {label: 'BANK TRANSFER', value: 'bank_tranfer'},
    {label: 'POS (Attract Extra 0.5% of Invoice)', value: 'pos'}
];

const PaymentScreen = ({navigation, route}) => {
    const { orderId } = route.params;
    const [mode, setMode] = useState(null);
    const [bank, setBank] = useState(null);
    const [form, setForm] = useState(null);
    const [clientType, setClientType] = useState(0);
    const [nameOnTransfer, setNameOnTransfer] = useState(null);
    const [referenceCode, setReferenceCode] = useState(null);
    const [document, setDocument] = useState(null);
    const [amountApplied, setAmountApplied] = useState(0.0);
    const [amountExpected, setAmountExpected] = useState(0.0);
    const [surge, setSurge] = useState(0.0);
    const [total, setTotal] = useState(0.0);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const {token, baseURL} = useSelector(state => state.loginReducer);

     const pullClient = async () => {
        await axios
           .get(`${baseURL}/invoice/payment/${orderId}`, {
               headers: {
                   Accept: 'application/json',
                   Authorization: `Bearer ${token}`,
                   timeout: 10000
               }
           })
           .then(res => {
                if(res.status === 200 && res.data.form.items != null){
                    
                    const amountDiff = res.data.form.items.total - res.data.form.items.amount_paid
                    setAmountApplied(amountDiff.toString())
                    setAmountExpected(amountDiff)
                    setClientType(res.data.form.client.credit_worthy)
                    setTotal(amountDiff)
                    setForm(res.data.form)
                  
                }
                else if(res.data.form.items === null){
                   ToastAndroid.show("Order has already been paid! Please refresh", ToastAndroid.SHORT);
                    navigation.navigate('Orders')
                }
                else if(res.status === 404) {
                   console.log(res)
                }
           })
           .catch(err => console.error(err));
    }

    const checkTotal = () => {
        if(amountApplied < total && clientType === 0){
            setDisabled(true)
            return setError("No credit Please")
        }
        else if(amountApplied > total) {
            setDisabled(true)
            return setError('Enter the exact amount!')
        }
        else {
            setDisabled(false)
        }
    }

    const numberFormatter = (number) => {
        return new Intl.NumberFormat('en-US').format(number)
    }

    const lineTotal = (qty, price) => qty * price;

    const totalSum = () => {
        let sum = 0
        form?.items.items.forEach(el => {
            sum += el.qty * el.unit_price
        })
        return sum
    }

    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
    }, []);

    const surgeCheck = (item) => {
        setMode(item);
        if(item === 'pos'){
            const pos_percent = 0.5/100;
            const surchargeAmt = (form?.items.total * pos_percent) + form?.items.total;
            return setAmountExpected(surchargeAmt);
        }
        else {
            return setAmountExpected(form?.items.total)
        }
    }

    useEffect(() => {
       
       pullClient()
    }, [orderId])

     const pickImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            const type = "image/"+result.uri.split('.').reverse()[0]
            const name = result.uri.split('/').pop()
            setDocument({
                uri: result.uri,
                name: name,
                type: 'image/jpeg'
            })
            setImage(result.uri)
        }
    };

    const onSubmit = async () => {
        setDisabled(true)
        let formData = new FormData();
        const items = [];
        if(amountApplied === null || amountApplied <= 0){
            return setError("Enter Amount Received")
        }
        else {
            items.push({
                'invoice_id': form?.items.id,
                'amount_applied': Number(amountApplied)
            });

            formData.append('client_id', form.client.id);
            formData.append('currency_id', form.client.currency_id);
            formData.append('payment_mode', mode);
            formData.append('payment_bank', bank);
            formData.append('name_for_transfer', nameOnTransfer);
            formData.append('reference_code', referenceCode);
            formData.append('date_transfer', Date.now());
            formData.append('document', document);
            formData.append('payment_date', form.payment_date);
            formData.append('amount_received', amountApplied);
            formData.append('amount_expected', amountExpected);
            formData.append('amount_applied', amountApplied);
            formData.append('items', JSON.stringify(items));

            await axios
            .post(`${baseURL}/invoice/payment`, formData, {
                headers: {
                        Authorization: `Bearer ${token}`,
                        timeout: 10000
                }
            })
            .then(res => {
                if(res.status === 200 && res.data){
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
                    navigation.pop('Orders');
                }
            })
            .catch(err => console.error(err));
        }
    }

    return (
        <View bg-dark40 marginB-s10>
            <Card borderRadius={10} marginH-s1 marginT-s1 style={{ backgroundColor: Colors.green80}}>
                <View spread row marginV-s2 marginH-s1>
                    <View flex-6 centerV center>
                        <Text text70>{form?.client.person}</Text>
                    </View>
                </View>
                <View spread row marginV-s2 marginH-s1>
                    <View flex-3 centerV>
                        <Text text80>Date: {form?.payment_date} </Text>
                    </View>
                    <View flex-3 centerV right>
                        <Text text80>{form?.number}</Text>
                    </View>
                </View>
                <View spread col marginV-s2 marginH-s1 borderWidth={1}>
                    <View centerV marginR-s1 borderBottomWidth={0.5}>
                        <Text uppercase padding-s1>PAYMENT MODE</Text>
                        <Picker
                            selectedValue={mode}
                            style={{textTransform: 'uppercase', marginBottom: 5}}
                            itemStyle={{textTransform: 'uppercase'}}
                            onValueChange={(itemValue, itemIndex) => {
                                surgeCheck(itemValue);
                            }}
                        >
                        {
                            _.map(paymentMode, (item, index) => (
                                    <Picker.Item key={index} label={item.label} value={item.value} />
                            ))
                        }
                        </Picker>
                    </View>
                    <View centerV>
                        <Text uppercase padding-s1>PAYMENT BANK</Text>
                        <Picker
                            selectedValue={bank}
                            style={{textTransform: 'uppercase', marginBottom: 5}}
                            onValueChange={(itemValue, itemIndex) =>
                                setBank(itemValue)
                            }
                        >
                            <Picker.Item key="default" label="Select a Bank" value={null} />
                        {   _.map(form?.banks, (item, index) => (
                                    <Picker.Item key={index} label={item.bank_name} value={item.id} />
                            ))
                        }
                        </Picker>
                    </View>
                </View>
                <View spread row marginH-s1>
                    <View flex-3 centerV marginR-s1>
                        <TextInput
                            style={{height: 40, borderWidth: 0.5, padding: 8}}
                            placeholder="NAME ON TRANSFER"
                            onChangeText={e => setNameOnTransfer(e)}
                            defaultValue={nameOnTransfer}
                        />
                    </View>
                    <View flex-3 centerV>
                        <TextInput
                            style={{height: 40, borderWidth: 0.5, padding: 8}}
                            placeholder="REFERENCE CODE"
                            onChangeText={e => setReferenceCode(e)}
                            defaultValue={referenceCode}
                        />
                    </View>
                </View>
                <View spread row marginH-s1 marginT-s1 paddingB-s1>
                    <View flex-3 marginR-s1>
                        <TouchableOpacity
                                onPress={() => pickImage()}
                            >
                            {image ? (
                                <View borderWidth={0.5} height={70} center style={{borderStyle: 'dotted'}}>
                                    <Image
                                        style={{ height: '100%', width:'100%' }}
                                        source={{ uri: image}}
                                    />
                                </View>
                            ): (
                                <View borderWidth={0.5} height={70} center style={{borderStyle: 'dotted'}}>
                                    <Entypo name="camera" size={24} color="black" />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View flex-3 centerV>
                        <TextInput
                            style={{height: 40, borderWidth: 0.5, paddingLeft: 8}}
                            placeholder="AMOUNT RECEIVED"
                            required={true}
                            onChangeText={e => {
                                setError(null)
                                setAmountApplied(e)
                            }}
                            defaultValue={amountApplied.toString()}
                            keyboardType="numeric"
                            textAlign="center"
                            onBlur={checkTotal}
                        />
                        {error !== null && (<Text style={{ color: 'red'}}>{error}</Text>)}
                    </View>
                </View>
            </Card>
            <Card borderRadius={0} marginH-s1 marginT-s1 padding-s1>
                <View margin-s2>
                    <Text uppercase text60 center>invoices details</Text>
                </View>
                <View spread horizontal row borderWidth={0.5} paddingH-s1>
                    <View flex-4 borderRightWidth={0.5}><Text marginV-s1 text80 uppercase style={{fontWeight: 'bold'}}>Item Description</Text></View>
                    <View flex-2 centerV right><Text text80 uppercase style={{fontWeight: 'bold', alignItems: 'flex-end'}}>SubTotal</Text></View>
                </View>
                <ScrollView height="31%" showsVerticalScrollIndicator={false}>
                    {_.map(form?.items.items, (item, index) => (
                        <View borderWidth={0.5} spread row horizontal key={index} paddingH-s1>
                            <View flex-4 borderRightWidth={0.5}>
                                <Text text90>{item?.product.text}</Text>
                                <Text text100 dark40>{item.qty} {item?.uom.text} X {item.unit_price}</Text>
                            </View>
                            <View flex-2 right centerV>

                                <Text center>{lineTotal(item.qty, item.unit_price)}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </Card>
            <Card baseline borderRadius={0} marginH-s1>
                <View spread horizontal row borderWidth={1} paddingH-s1>
                    <View flex-4 borderRightWidth={0.5} paddingR-s1 right><Text marginV-s1 text80 uppercase style={{fontWeight: 'bold'}}>Total Due:</Text></View>
                    <View flex-2 right centerV><Text text80 uppercase style={{fontWeight: 'bold'}}>{'\u20A6'}{numberFormatter(total)}</Text></View>
                </View>
            </Card>
            <Card baseline borderRadius={0} marginH-s1>
                <View spread row paddingH-s1 center>
                    <View flex-6 centerV paddingV-s1>
                        <Button onPress={() => {
                            if(amountApplied === null || amountApplied <= 0){
                                return setError("Enter Amount Received")
                            }
                            else {
                                Alert.alert('Confirm Action', 'Are you sure make payment for this Invoice?', 
                                [
                                    {
                                        text: "CANCEL",
                                    },
                                    { text: "YES", onPress: () => onSubmit() }
                                ])
                            }
                        }} disabled={disabled ? true : false} size={Button.sizes.small} label="POST PAYMENT"></Button>
                    </View>
                </View>
            </Card>
        </View>
    )
}

export default PaymentScreen
