import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import fb from '../../utils/firebase'
import InfoUser from '../../components/Account/InfoUser'
import Toast from 'react-native-easy-toast'

export default function UserLogged() {
    const [userInfo, setUserInfo] = useState(null);
    const toastRef = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fb.getUserInfo();
                setUserInfo(data);
            } catch (error) {
                setUserInfo(null);
            }
        })()
    }, [])

    return (
        <View style={styles.viewContainer}>
            {userInfo && <InfoUser userInfo={userInfo} toastRef={toastRef} />}
            <Text>User logged</Text>
            <Button title="Cerrar sesión" onPress={() => fb.logout()} />
            <Toast ref={toastRef} position="bottom" opacity={0.8} />
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        paddingHorizontal: 30,
        paddingTop: 30,
    }
})