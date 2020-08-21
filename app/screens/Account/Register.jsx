import React, { useRef } from 'react'
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-elements'
import RegisterForm from '../../components/Account/RegisterForm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-easy-toast'

function Register() {
    const toastRef = useRef();

    return (
        <KeyboardAwareScrollView>
            <View style={styles.scrollBody}>
                <Image
                    source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
                    resizeMode="contain"
                    style={styles.image}
                />
                <RegisterForm {...{ toastRef }} />
            </View>
            <Toast ref={toastRef} position="top" opacity={0.8} />
        </KeyboardAwareScrollView>
    )
}

export default Register

const styles = StyleSheet.create({
    scrollBody: {
        paddingHorizontal: 30
    },
    image: {
        width: "100%",
        height: 150,
        marginVertical: 30
    },
    registerContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    },
})
