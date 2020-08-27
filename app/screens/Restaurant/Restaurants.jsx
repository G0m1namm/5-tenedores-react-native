import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import fb from '../../utils/firebase'
import { Icon } from 'react-native-elements';

export default function Restaurants({ navigation }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fb.auth.onAuthStateChanged(userInfo => {
            setUser(userInfo)
        })
    }, [])

    return (
        <View style={styles.viewBody}>
            {user &&
                <Icon
                    type="material-community"
                    name="plus"
                    color="#00a680"
                    reverse
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate("add-restaurant")}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
    },
    btnContainer: {
        position: "absolute",
        bottom: 16,
        right: 16,
    }
})