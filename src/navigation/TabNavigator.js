import React from 'react'
import {Alert} from 'react-native'
import {Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons'
import {Colors} from 'react-native-ui-lib'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {useDispatch} from 'react-redux';

import HomeScreen from '../screens/HomeScreen'
import OrderScreen from '../screens/OrderScreen'
import ProfileScreen from '../screens/ProfileScreen'
import NewOrderScreen from '../screens/NewOrderScreen'
import OrderDetailScreen from '../screens/OrderDetailScreen'
import PaymentScreen from '../screens/PaymentScreen'
import { userLogOut } from '../redux/actions/login.action'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const TabNavigator = () => {
    const dispatch = useDispatch();

    const Logout = async (navigation) => {
        await dispatch(userLogOut());
    } 

    return (
        <Tab.Navigator
            initialRouteName="Dashboard"
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: Colors.green10,
                tabBarInactiveTintColor: Colors.green40,
                headerTintColor: '#fff',
                headerStyle: {
                    backgroundColor: Colors.green20,
                }
            })}
        >
            <Tab.Screen name="Dashboard" component={HomeScreen} 
                 options={({ navigation, route }) => ({
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" color={color} size={size} />
                    ),
                    headerRight: () => (
                        <MaterialIcons onPress={() => Alert.alert('Action Confirmation','Are you sure to Logout of session?',
                            [
                                {
                                    text: "CANCEL",
                                },
                                { text: "YES", onPress: () => Logout(navigation) }
                            ])} name="logout" size={28} color="white" />
                    ),
                })}
            />
            <Tab.Screen 
                name="OrderTab"
                options={
                    {
                        headerShown: false,
                        tabBarLabel: 'Sales Order',
                        tabBarIcon: ({ color, size }) => (
                            <AntDesign name="shoppingcart" color={color} size={size} />
                        )
                    }
                }
            >
                {() => (
                    <Stack.Navigator
                        screenOptions={{
                            headerTintColor: '#fff',
                            headerStyle: {
                                backgroundColor: Colors.green20,
                            },
                        }}
                    >
                        <Stack.Screen name="Orders" component={OrderScreen} 
                            options={({ navigation, route }) => ({
                                headerTitle: "Sales Order",
                                headerRight: () => (
                                    <MaterialIcons onPress={() => navigation.navigate('NewOrder')} name="add-shopping-cart" size={28} color="white" />
                                ),
                            })}
                        />
                        <Stack.Screen name="NewOrder" component={NewOrderScreen} options={{title: "Order Placement"}} />
                        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={({ route }) => ({ title: route.params.name })} />
                        <Stack.Screen name="Payment" component={PaymentScreen} options={{title: "Order Payment"}} />
                    </Stack.Navigator>
                )}
            </Tab.Screen>
            <Tab.Screen name="Me" component={ProfileScreen}
                 options={{
                    tabBarLabel: 'Me',
                    headerTitle: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="user" color={color} size={size} />
                    )
                }} 
            />
        </Tab.Navigator>
    )
}

export default TabNavigator
