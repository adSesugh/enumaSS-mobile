import React from 'react';
import {Colors} from 'react-native-ui-lib'
import {Ionicons, FontAwesome, Feather, AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from '../screens/HomeScreen'
import OrderScreen from '../screens/OrderScreen'
import ProfileScreen from '../screens/ProfileScreen'
import NewOrderScreen from '../screens/NewOrderScreen'
import OrderDetailScreen from '../screens/OrderDetailScreen'
import PaymentScreen from '../screens/PaymentScreen'
import ProductScreen from '../screens/ProductScreen';
import PaymentsScreen from '../screens/PaymentsScreen'
import PickupScreen from '../screens/PickupScreen';
import ClientScreen from '../screens/ClientScreen';
import ReceivableScreen from '../screens/ReceivableScreen'
import ReservedScreen from '../screens/ReservedScreen'
import ProductUpdateScreen from '../screens/ProductUpdateScreen'

import Sidebar from './Sidebar'

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator()
 
const DrawerNavigator = () => {
    return (
        <Drawer.Navigator drawerContent={props => <Sidebar {...props} />} screenOptions={{
            drawerActiveTintColor: Colors.pink40,
            drawerInactiveTintColor: Colors.dark10,
            drawerLabelStyle: {
                textTransform: 'uppercase'
            }
        }}>
            <Drawer.Screen 
                name="Dashboard" 
                component={HomeScreen} 
                options={{ 
                    drawerIcon: ({focus, color, size}) => (
                        <AntDesign name="home" color={color} size={size} />
                    ),
                    headerTintColor: '#fff',
                    headerStyle: {
                        backgroundColor: Colors.green20,
                    },
                    headerTitleAlign: 'center'
                }}
            />
            <Drawer.Screen 
                name="ODrawer" 
                options={{ 
                    drawerIcon: ({focus, color, size}) => (
                        <AntDesign name="shoppingcart" color={color} size={size} />
                    ),
                    title: 'Sales Order',
                    headerShown: false,
                }}
            >
                {() => (
                    <Stack.Navigator
                        initialRouteName="Orders"
                        screenOptions={{
                            headerTintColor: '#fff',
                            headerStyle: {
                                backgroundColor: Colors.green20,
                            },
                            headerTitleAlign: 'center'
                        }}
                    >
                        <Stack.Screen name="Orders" component={OrderScreen} 
                            options={({ navigation, route }) => ({
                                title: "Sales Order",
                                headerLeft: () => (
                                    <MaterialIcons onPress={() => navigation.openDrawer()} name="menu" size={28} color="white" />
                                ),
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
            </Drawer.Screen>
            <Drawer.Screen 
                name="PDrawer" 
                options={{ 
                    drawerIcon: ({focus, color, size}) => (
                        <FontAwesome name="product-hunt" color={color} size={size} />
                    ),
                    title: 'Products',
                    headerShown: false
                }}
            >
                {() => (
                    <Stack.Navigator
                        initialRouteName="Products"
                        screenOptions={{
                            headerTintColor: '#fff',
                            headerStyle: {
                                backgroundColor: Colors.green20,
                            },
                            headerTitleAlign: 'center'
                        }}
                    >
                        <Stack.Screen name="Products" component={ProductScreen}  options={({ navigation, route }) => ({
                                title: "Products",
                                headerLeft: () => (
                                    <MaterialIcons onPress={() => navigation.openDrawer()} name="menu" size={28} color="white" />
                                ),
                            })} 
                        />
                        <Stack.Screen name="ProductUpdate" component={ProductUpdateScreen} options={
                                ({ route }) => ({ 
                                    title: route.params.name,
                                    headerTitleStyle: {
                                        fontSize: 8,
                                        fontWeight: 'bold'
                                    },
                                })
                            } 
                        />
                    </Stack.Navigator>
                )}
            </Drawer.Screen>
            <Drawer.Screen 
                name="Clients" 
                component={ClientScreen} 
                options={{ 
                    drawerIcon: ({focus, color, size}) => (
                        <Feather name="users" color={color} size={size} />
                    ),
                    headerTintColor: '#fff',
                    headerStyle: {
                        backgroundColor: Colors.green20,
                    },
                    headerTitleAlign: 'center'
                }}
            />
            <Drawer.Screen 
                name="Payments" 
                component={PaymentsScreen} 
                options={{ 
                    drawerIcon: ({focus, color, size}) => (
                        <MaterialIcons name="payments" color={color} size={size} />
                    ),
                    headerTintColor: '#fff',
                    headerStyle: {
                        backgroundColor: Colors.green20,
                    },
                    headerTitleAlign: 'center'
                }}
            />
            <Drawer.Screen 
                name="Receivables" 
                component={ReceivableScreen} 
                options={{ 
                    drawerIcon: ({focus, color, size}) => (
                        <MaterialIcons name="money" color={color} size={size} />
                    ),
                    headerTintColor: '#fff',
                    headerStyle: {
                        backgroundColor: Colors.green20,
                    },
                    headerTitleAlign: 'center'
                }}
            />
            <Drawer.Screen 
                name="Client pickUps" 
                component={PickupScreen} 
                options={{ 
                    drawerIcon: ({focus, color, size}) => (
                        <MaterialCommunityIcons name="car-pickup" color={color} size={size} />
                    ),
                    headerTintColor: '#fff',
                    headerStyle: {
                        backgroundColor: Colors.green20,
                    },
                    headerTitleAlign: 'center'
                }}
            />
            <Drawer.Screen 
                name="RODrawer" 
                options={{ 
                    drawerIcon: ({focus, color, size}) => (
                        <MaterialCommunityIcons name="content-save-all-outline" color={color} size={size} />
                    ),
                    title: 'Reserved Orders',
                    headerShown: false,
                }}
            >
                {() => (
                    <Stack.Navigator
                        initialRouteName="Reserved Orders"
                        screenOptions={{
                            headerTintColor: '#fff',
                            headerStyle: {
                                backgroundColor: Colors.green20,
                            },
                            headerTitleAlign: 'center'
                        }}
                    >
                        <Stack.Screen name="Reserved Orders" component={ReservedScreen} options={({ navigation, route }) => ({
                                title: "Reserved Orders",
                                headerLeft: () => (
                                    <MaterialIcons onPress={() => navigation.openDrawer()} name="menu" size={28} color="white" />
                                ),
                            })}
                        />
                        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={({ route }) => ({ title: route.params.name })} />
                    </Stack.Navigator>
                )}
            </Drawer.Screen>
            <Drawer.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{ 
                    drawerIcon: ({focus, color, size}) => (
                        <AntDesign name="user" color={color} size={size} />
                    ),
                    headerTintColor: '#fff',
                    headerStyle: {
                        backgroundColor: Colors.green20,
                    },
                    headerTitleAlign: 'center'
                }}
            />
        </Drawer.Navigator>
    )
}

export default DrawerNavigator
