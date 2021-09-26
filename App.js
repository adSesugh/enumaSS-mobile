import React, {useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-status-bar';
import { Colors} from 'react-native-ui-lib'
import { SafeAreaView } from 'react-native-safe-area-context'
import { saveBaseURL } from './src/redux/actions/login.action'
import { useDispatch, useSelector } from 'react-redux'

import Navigation from './src/navigation'

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.loginReducer);
  
  const baseURL = (value) => {
        dispatch(saveBaseURL(value))
  }

  useEffect(()=> {
    if(!token) {
      baseURL(false)
    }
  }, [])

  // const checkForNewVersion = async() => {
  //   try {
  //     const update = await Updates.checkForUpdateAsync()
  //     if(update.isAvailable) {
  //       await Updates.fetchUpdateAsync()
  //       Updates.reloadAsync()
  //     }
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  // useEffect(() => {
  //   checkForNewVersion()
  // }, [])

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar style="light" barStyle={Colors.green30} backgroundColor={Colors.green20} />
      <Navigation />
    </SafeAreaView>
  );
}
