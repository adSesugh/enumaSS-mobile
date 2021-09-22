import React, {useState, useEffect} from 'react'
import {Alert, Image, TextInput, ToastAndroid, StyleSheet} from 'react-native'
import { Card, Colors, View, Text, Button, Switch, TextField} from 'react-native-ui-lib'
import { LinearGradient } from 'expo-linear-gradient'
import { useForm, Controller } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { userLogin, saveBaseURL } from '../redux/actions/login.action'
import {Ionicons, AntDesign} from '@expo/vector-icons'
import Loader from '../components/Loader'

import Logo from '../../assets/ess.png'

const LoginScreen = () => {
    const { control, handleSubmit, formState: { errors, isDirty, isValid } } = useForm()
    const { token, user, loading, error } = useSelector(state => state.loginReducer)
    const dispatch = useDispatch()
    const [urlState, setUrlState] = useState(false)

    const baseURL = (value) => {
        dispatch(saveBaseURL(value))
    }
    useEffect(()=> {
        baseURL(urlState)
    }, [])

    const onChange = arg => {
        return {
            value: arg.nativeEvent.text
        }
    }

    const onSubmit = async (data) => await dispatch(userLogin(data));

    return (
        <>
            {loading ? <Loader /> : (
                <LinearGradient
                    colors={[Colors.green20, 'white', 'white']}
                    style={{flex: 1}}
                >
                    <View flex center>
                        <Image style={{width: 180, height: 55, margin: 60}} source={Logo} />
                        <Card padding-s5 borderRadius={20} style={{backgroundColor: Colors.green30}}>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder='Email Address'
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                )}
                                name="email"
                                defaultValue=""
                            />
                            {errors.email && <Text>This is required.</Text>}
                            <Controller
                                control={control}
                                rules={{
                                    maxLength: 100,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry
                                />
                                )}
                                name="password"
                                defaultValue=""
                            />
                            <View spread row marginT-s2>
                                <View right flex-2>
                                    {/* <Text text80 white uppercase>Local</Text> */}
                                </View>
                               <View flex-2 center>
                                    <Switch
                                        onColor={Colors.green10}
                                        offColor={Colors.dark10}
                                        value={urlState}
                                        onValueChange={(v: boolean) => {
                                            setUrlState(v)
                                            baseURL(v)
                                        }}
                                    />
                               </View>
                                <View flex-2 left>
                                    {/* <Text text80 white uppercase>Online</Text> */}
                                </View>
                            </View>
                            <Button style={styles.button} label="Let's Go" onPress={handleSubmit(onSubmit)} iconOnRight={<AntDesign name="login" color="white" size="20" />} />
                        </Card>
                    </View>
                    {error && ToastAndroid.show(error, ToastAndroid.SHORT)}
                </LinearGradient>    
            )}
        </>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
  label: {
        color: 'white',
        margin: 20,
        marginLeft: 0,
    },
    button: {
        margin: 10,
        width: 220,
        color: 'white',
        height: 40,
        borderRadius: 10,
        backgroundColor: Colors.dark30
    },
    input: {
        backgroundColor: 'white',
        height: 40,
        width: 230,
        padding: 10,
        margin: 1,
        borderRadius: 50
    },
});
