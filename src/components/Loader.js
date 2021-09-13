import React from 'react'
import {ActivityIndicator } from 'react-native'
import {Colors, View, Text} from 'react-native-ui-lib'
import { LinearGradient } from 'expo-linear-gradient'

function Loader() {
    return (
        <LinearGradient
            colors={[Colors.green20, 'white', 'white']}
            style={{flex: 1}}
        >
            <View flex center useSafeArea>
                <ActivityIndicator color={Colors.dark10} size={30} />
                <Text >Loading</Text>
            </View>
        </LinearGradient>
    )
}

export default Loader