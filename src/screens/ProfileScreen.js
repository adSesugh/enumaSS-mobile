import React, {useCallback, useState} from 'react'
import { Alert } from 'react-native'
import { AvatarHelper, Avatar, Card, Colors, Image, View, Text, Button} from 'react-native-ui-lib'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'

import Loader from '../components/Loader'
import { userProfile } from '../redux/actions/profile'
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import Logo from '../../assets/cover.png'

const ProfileScreen = ({navigation, route}) => {
    const dispatch = useDispatch()
    const { user, loading, error } = useSelector(state => state.profileReducer)
    const uInfo = user
    const profile = async () => await dispatch(userProfile())

    useFocusEffect(
        
        useCallback(() => {
            let isActive = true;
            
            profile();
            return () => {
                isActive = false;
            };
        }, [])
    );

    const numberFormatter = (number) => {
        return new Intl.NumberFormat('en-US').format(number)
    }

    return (
        <>
            {loading ? <Loader/> : (
                <View>
                    <Card bg-green30 padding-s1 center borderRadius={0}>
                        <View spread col>
                        <View center><Text text70 gray10>{uInfo?.location}</Text></View>
                        <View center><Text text80>{uInfo?.lcontact}</Text></View>
                        <View center><Text text90>{uInfo?.laddress}</Text></View>
                        </View>
                    </Card>
                    <Card borderRadius={0}>
                        <View row centerV height={180}>
                            <Image
                                style={{ height: 180, width:'100%' }}
                                source={Logo}
                            />
                        </View>
                    </Card>
                    <Card marginV-s1>
                        <LinearGradient
                            colors={[Colors.green20, 'white', Colors.dark50]}
                        >
                            <View spread row padding-s3>
                                <View flex-5>
                                    <View>
                                        <Text text60 uppercase>{uInfo?.name}</Text>
                                    </View>
                                    <View>
                                        <Text uppercase>{uInfo?.title}</Text>
                                    </View>
                                    <View>
                                        <Text >{uInfo?.email}</Text>
                                    </View>
                                    <View>
                                        <Text>{uInfo?.mobile}</Text>
                                    </View>
                                </View>
                                <View flex center>
                                    <Avatar
                                        size={64}
                                        label={AvatarHelper.getInitials(uInfo?.name)}
                                    />
                                </View>
                            </View>
                        </LinearGradient>
                    </Card>
                    <>
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
                                                <Text dark10 text60 uppercase margin-s2>{'\u20A6'}{numberFormatter(uInfo?.dailySales)}</Text>
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
                                                <Text dark10 text60 uppercase margin-s2>{'\u20A6'}{numberFormatter(uInfo?.receivables)}</Text>
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
                                                <Text dark10 text60 uppercase margin-s2>{uInfo?.open_sales_orders}</Text>
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
                                                <Text gray10 text80 uppercase margin-s2>unpaid invoice</Text>
                                            </View>
                                            <View marginT-s3 bottom center>
                                                <Text dark10 text60 uppercase margin-s2>{uInfo?.unpaidInvoices}</Text>
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
                                                <Text gray10 text80 uppercase margin-s2>pick-ups</Text>
                                            </View>
                                            <View marginT-s2 bottom center>
                                                <Text dark10 text60 uppercase margin-s2>{uInfo?.pickUps}</Text>
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
                                                <Text gray10 text80 uppercase margin-s2>attended to</Text>
                                            </View>
                                            <View marginT-s3 bottom center>
                                                <Text dark10 text60 uppercase margin-s2>{uInfo?.attendedTo}</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </Card>
                            </View>
                        </LinearGradient>
                    </>
                </View>
            )}
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

export default ProfileScreen
