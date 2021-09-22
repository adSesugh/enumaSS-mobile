import React from 'react'
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Button, Card, View, Text} from 'react-native-ui-lib';

const ListHeader = ({total, label}) => {

    const numberFormatter = (number) => {
        return new Intl.NumberFormat('en-US').format(number)
    }

    return (
        <Card fixed borderRadius={0}>
            <View spread horizontal row borderWidth={1} paddingH-s1>
                <View flex-4 borderRightWidth={0.5} paddingR-s1 right><Text marginV-s1 text80 uppercase style={{fontWeight: 'bold'}}>{label}:</Text></View>
                <View flex-2 right centerV><Text text80 uppercase style={{fontWeight: 'bold'}}>{'\u20A6'}{numberFormatter(total)}</Text></View>
            </View>
        </Card>
    )
}

export default ListHeader
