import React, { useRef } from 'react'
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import LoginForm from '../../components/Account/LoginForm';
import Toast from 'react-native-easy-toast';
import LoginFacebook from '../../components/Account/LoginFacebook';

function Login() {
    const navigation = useNavigation();
    const toastRef = useRef();

    return (
        <ScrollView style={styles.scrollBody}>
            <Image
                source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <LoginForm {...{ toastRef }} />
            <View style={styles.registerContainer}>
                <Text>
                    ¿Aún no tienes una cuenta?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("register")}>
                    <Text style={{ color: "#00a680" }}>Regístrate</Text>
                </TouchableOpacity>
            </View>
            <Toast ref={toastRef} position="top" opacity={0.8} />
            <Divider style={{ backgroundColor: "#00a680", marginVertical: 10 }} />
            <LoginFacebook {...{ toastRef }} />
        </ScrollView>
    )
}

export default Login

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
        alignItems: "center",
        marginTop: 20
    },
})
