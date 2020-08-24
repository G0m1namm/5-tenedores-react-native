import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { SocialIcon } from 'react-native-elements'
import fb from '../../utils/firebase'
import * as facebook from 'expo-facebook';
import { useNavigation } from '@react-navigation/native';
import Loading from '../Loading';

function LoginFacebook({ toastRef }) {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const onLogin = async () => {
        await facebook.initializeAsync('1300748476983773');
        const { type, token } = await facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile'],
        });
        onType(type, token)
    }

    const onType = async (type, token) => {
        switch (type) {
            case "success":
                setLoading(true);
                const credential = fb.getFacebookCredentials(token);
                try {
                    await fb.loginWithCredentials(credential);
                    setLoading(false);
                    navigation.navigate("account");
                } catch (error) {
                    setLoading(false);
                    toastRef.current.show("Credenciales incorrectas");
                }
                break;

            case "cancel":
                toastRef.current.show("Inicio de sesión cancelado");

                break;

            default:
                toastRef.current.show("Error desconocido, intente más tarde");
                break;
        }
    }

    return (
        <>
            <SocialIcon
                title="Iniciar sesión con Facebook"
                type="facebook"
                button
                onPress={onLogin}
            />
            <Loading text="iniciando sesión" isVisible={loading} />
        </>
    )
}

export default LoginFacebook

const styles = StyleSheet.create({})
