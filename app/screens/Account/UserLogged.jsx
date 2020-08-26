import React, { useState, useEffect, useRef, createContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import fb from '../../utils/firebase'
import InfoUser from '../../components/Account/InfoUser'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading'
import AccountOptions from '../../components/Account/AccountOptions'

export const RefreshCompProvider = createContext();

export default function UserLogged() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loaderText, setLoaderText] = useState("");
    const [refresh, setRefresh] = useState(false);
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
    }, [refresh])

    return (
        <RefreshCompProvider.Provider value={{ setRefresh }}>
            <View style={styles.viewContainer}>
                {userInfo &&
                    <>
                        <InfoUser
                            userInfo={userInfo}
                            toastRef={toastRef}
                            setLoading={setLoading}
                            setLoaderText={setLoaderText}
                        />
                        <AccountOptions userInfo={userInfo} toastRef={toastRef} />
                    </>
                }
                {/* <Button title="Cerrar sesión" onPress={() => fb.logout()} /> */}
                <Toast ref={toastRef} position="bottom" opacity={0.8} />
                <Loading isVisible={loading} text={loaderText} />
            </View>
        </RefreshCompProvider.Provider>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        paddingTop: 30,
    }
})