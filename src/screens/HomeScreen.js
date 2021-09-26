import React, { useEffect, useCallback } from 'react'
import {Alert, ScrollView} from 'react-native';
import { Card, Colors, View, Text, Button} from 'react-native-ui-lib'
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch, useSelector } from 'react-redux'
import { userDashboard } from '../redux/actions/home.action'
import Loader from '../components/Loader'
import EmptyList from '../components/EmptyList'
import moment from 'moment'
import { useFocusEffect } from '@react-navigation/native';
import { userLogOut } from '../redux/actions/login.action'

const HomeScreen = () => {
    const dispatch = useDispatch()
    const { rdash, loading, error } = useSelector(state => state.homeReducer)

    const numberFormatter = (number) => {
        return new Intl.NumberFormat('en-US').format(number)
    }
    
    const callApI = async () => await dispatch(userDashboard())

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            callApI();

            return () => {
                isActive = false;
            };
        }, [])
    );
    
    if(loading) {
        return <Loader />
    }

    return (
        <View flex bg-dark50>
            <LinearGradient
                colors={[Colors.green20, 'white', Colors.dark50]}
            >
                <View spread row borderRadius={5} marginB-s1 marginT-s1>
                    <Card flex-3 marginL-s1 height={100}>
                        <LinearGradient
                            colors={[Colors.green20, 'white', Colors.dark50]}
                            start={{ x: 1, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            style={{flex: 1, borderRadius: 10}}
                        >
                            <View spread evenly col padding-s2>
                                <View center middle>
                                    <Text gray10 text80 uppercase margin-s2>Daily Sales</Text>
                                </View>
                                <View marginT-s3 bottom center>
                                    <Text dark10 text60 uppercase margin-s2>{'\u20A6'}{numberFormatter(rdash?.dailySales)}</Text>
                                </View>
                            </View>
                            </LinearGradient>
                    </Card>
                    <Card flex-3 marginH-s1>
                        <LinearGradient
                            colors={[Colors.green20, 'white', Colors.dark50]}
                            style={{flex: 1, borderRadius: 10}}
                        >
                            <View spread evenly col padding-s2>
                                <View center middle>
                                    <Text gray10 text80 uppercase margin-s2>Receivables</Text>
                                </View>
                                <View marginT-s3 bottom center>
                                    <Text dark10 text60 uppercase margin-s2>{'\u20A6'}{numberFormatter(rdash?.receivables)}</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </Card>
                </View>
                <View spread row borderRadius={5} marginB-s1>
                    <Card flex-3 marginL-s1 height={100}>
                        <LinearGradient
                            colors={[Colors.green20, 'white', Colors.dark50]}
                            start={{ x: 1, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            style={{flex: 1, borderRadius: 10}}
                        >
                            <View spread evenly col padding-s2>
                                <View center middle>
                                    <Text gray10 text80 uppercase margin-s2>Reserved orders</Text>
                                </View>
                                <View marginT-s2 bottom center>
                                    <Text dark10 text60 uppercase margin-s2>{rdash?.open_sales_orders}</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </Card>
                    <Card flex-3 marginH-s1>
                        <LinearGradient
                            colors={[Colors.green20, 'white', Colors.dark50]}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{flex: 1, borderRadius: 10}}
                        >
                            <View spread evenly col padding-s2>
                                <View center middle>
                                    <Text gray10 text80 uppercase margin-s2>client pick-up</Text>
                                </View>
                                <View marginT-s3 bottom center>
                                    <Text dark10 text60 uppercase margin-s2>{rdash?.pickUps}</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </Card>
                </View>
            </LinearGradient>
            <LinearGradient
                colors={[Colors.green20, Colors.dark50, Colors.green50]}
                style={{flex: 1, borderRadius: 3}}
            >
                <View paddingV-s1 paddingH-s2><Text white text70 uppercase>List of Debtors</Text></View>
            </LinearGradient>
            <View height="29%" bg-dark80>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {rdash?.debtors.length ? (
                        <>
                            {rdash.debtors.map((item, index) => {
                                return (
                                    <View spread row key={index} borderWidth={0.5} paddingH-s1>
                                        <View borderRightWidth={1} flex-4>
                                            <Text text90 uppercase italic>{item.text}</Text>
                                            <Text text100 italic>{item.mobile_number}</Text>
                                        </View>
                                        <View centerV right flex-2>
                                            <Text gray30 >{'\u20A6'}{numberFormatter(item.due_balance)}</Text>
                                        </View>
                                    </View>
                                )
                            })}
                        </>
                    ) : (
                        <EmptyList />
                    )}
                </ScrollView>
            </View>
            <LinearGradient
                colors={[Colors.green20, Colors.dark50, Colors.green50]}
                style={{flex: 1, borderRadius: 3}}
            >
                <View paddingV-s1 paddingH-s2><Text white text70 uppercase>unpaid invoices</Text></View>
            </LinearGradient>
            <View height="30%" bg-dark80>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {rdash?.unpaidInvoices.length ? (
                        <>
                            {rdash?.unpaidInvoices.map((invoice, index) => {
                                return (
                                    <View spread row key={index} borderWidth={0.5} paddingH-s1>
                                        <View borderRightWidth={1} flex-4>
                                            <Text text90 uppercase italic>{invoice.client.text}</Text>
                                            <Text text100 italic>{invoice.number} - {moment(invoice.created_at).format('Do MMM Y')}</Text>
                                        </View>
                                        <View centerV right flex-2>
                                            <Text gray30>{'\u20A6'}{numberFormatter(invoice.due_amount)}</Text>
                                        </View>
                                    </View>
                                )
                            })}
                        </>
                    ) : (
                        <EmptyList />
                    )}
                </ScrollView>
            </View>
            {error && Alert.alert('Oops! Error', error, [
                    {
                        text: "TRY AGAIN", onPress: () => dispatch({type: 'RESET_ERROR'})
                    },
                    { text: "CHANGE SERVER", onPress: () => dispatch({type: 'RESET_LOGIN'}) }
                ])
            }
        </View>
    )
}

export default HomeScreen
