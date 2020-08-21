import React from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-elements'
import fb from '../../utils/firebase'

export default function UserLogged() {
    return (
        <View>
            <Text>User logged</Text>
            <Button title="Cerrar sesión" onPress={() => fb.logout()} />
        </View>
    )
}
