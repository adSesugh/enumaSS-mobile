import React from 'react'
import moment from 'moment';
import 'intl';
import 'intl/locale-data/jsonp/en';
import {StyleSheet } from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import {AnimatableManager, Chip, Colors, Spacings, ListItem, Text, Avatar, AvatarHelper } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';

const ItemList = ({id, name, amount, location, createdAt, others, color, path}) => {
    const animationProps = AnimatableManager.getEntranceByIndex(id)
    const navigation = useNavigation()

    const styles = StyleSheet.create({
        border: {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: Colors.dark70,
            paddingRight: 4
        },
        avatar: {
            marginHorizontal: 4,
            backgroundColor: Colors.green60,
            color: Colors.dark80,
        },
        middle: {
            marginBottom: 3
        },
        text: {
            flex: 1,
            marginRight: 10
        },
        subtitle: {
            marginTop: 2
        }
    });
  
    const numberFormatter = (number) => {
        return new Intl.NumberFormat('en-US').format(number)
    }

    return (
        <AnimatableView {...animationProps}>
            <ListItem
                height={75.8}
                onPress={() => path ? navigation.navigate(path, {orderId: id}) : {}}
            >
                <ListItem.Part left>
                    <Avatar
                        size={54}
                        label={AvatarHelper.getInitials(name)}
                        containerStyle={styles.avatar}
                    />
                </ListItem.Part>
                <ListItem.Part middle column containerStyle={styles.border}>
                    <ListItem.Part containerStyle={styles.middle}>
                        <Text style={styles.text} text70 color={Colors.dark10} numberOfLines={1}>{name}</Text>
                        <Text style={styles.subtitle} text90 color={Colors.dark20}>{'\u20A6'}{numberFormatter(amount)}</Text>
                    </ListItem.Part>
                    <ListItem.Part>
                        <Text style={styles.text} text90 color={Colors.dark40} numberOfLines={1}>{location}</Text>
                        <Text>
                            <Chip
                                label={createdAt ? moment(createdAt).format('Y-MMM-D') : others}
                                labelStyle={{color: Colors.white}}
                                containerStyle={{borderColor: Colors.dark70, backgroundColor: color ? color : Colors.dark50, marginLeft: Spacings.s1}}
                            />
                        </Text>
                    </ListItem.Part>
                </ListItem.Part>
            </ListItem>
        </AnimatableView>
    )
}

export default ItemList
