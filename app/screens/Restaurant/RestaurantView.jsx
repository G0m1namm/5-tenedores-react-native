import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function RestaurantView({ navigation, route }) {
    const { id, name } = route.params;
    navigation.setOptions({ title: name })
    return (
        <View>
            <Text></Text>
        </View>
    )
}

const styles = StyleSheet.create({})
