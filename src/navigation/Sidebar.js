import React from 'react';
import {Alert} from 'react-native'
import {Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, useDrawerProgress, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import {View, Colors, Avatar, AvatarHelper, Text} from 'react-native-ui-lib'
import { LinearGradient } from 'expo-linear-gradient'
import Animated from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';

import { userLogOut } from '../redux/actions/login.action'

const Sidebar = ({...props}) => {
    const progress = useDrawerProgress();
    const dispatch = useDispatch();
    const avatarBadgeProps = {backgroundColor: Colors.green20};
    const { user } = useSelector(state => state.loginReducer)
    // const translateX = Animated.interpolate(progress, {
    //     inputRange: [0, 1],
    //     outputRange: [-100, 0],
    // });

    const Logout = async () => {
        await dispatch(userLogOut());
    }

    return (
         <LinearGradient
            colors={[Colors.green20, 'white', Colors.dark60]}
            style={{flex: 1}}
        >
            <View flex spread col vertical>
                <View height="15%" center>
                    <View flex spread row>
                        <View flex-2 center left>
                            <Avatar
                                size={74}
                                //source={imageSource}
                                badgeProps={avatarBadgeProps}
                                label={AvatarHelper.getInitials(user?.name)}
                                containerStyle={{backgroundColor: Colors.grey60, color: Colors.dark80 }}
                            />
                        </View>
                        <View flex-4 centerV>
                            <Text uppercase text70 white>{user?.name}</Text>
                            <Text uppercase text100 dark70>{user?.role}</Text>
                        </View>
                    </View>
                </View>
                <View flex centerV height="80%">
                    <DrawerContentScrollView {...props} style={{height: "80%"}}>
                        <DrawerItemList {...props} />
                    </DrawerContentScrollView>
                </View>
                <View marginT-s2>
                    <DrawerItem 
                        label="Logout" 
                        icon={({size, color}) => (
                            <AntDesign name="logout" color={color} size={size} />
                        )}
                        onPress={() => Alert.alert('Action Confirmation','Are you sure to Logout of session?',
                            [
                                {
                                    text: "CANCEL",
                                },
                                { text: "YES", onPress: () => Logout() }
                            ])}
                    />
                </View>
            </View>
        </LinearGradient>
    )
}

export default Sidebar
