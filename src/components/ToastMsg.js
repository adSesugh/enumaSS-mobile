import React from 'react'
import {Toast, Colors} from 'react-native-ui-lib'

const ToastMsg = ({msg, message, openDialog, setOpenDialog}) => {
    return (
        <Toast
            visible={openDialog}
            position={'bottom'}
            autoDismiss={3000}
            centerMessage={true}
            showDismiss={true}
            message={msg ? msg : message}
            backgroundColor={msg ? Colors.green30 : Colors.red30 }
            onDismiss={() => {
                setOpenDialog(false)
            }}
            style={{margin: 15, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}
        >
        </Toast>
    )
}

export default ToastMsg
