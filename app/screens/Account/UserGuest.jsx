import React from 'react'
import { View, ScrollView, Image, StyleSheet } from 'react-native'
import { Button, Text } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

export default function UserGuest() {
    const navigation = useNavigation();
    return (
        <ScrollView centerContent={true} style={styles.scrollBody}>
            <Image
                source={require("../../../assets/img/user-guest.jpg")}
                resizeMode="contain"
                style={styles.image}
            />
            <Text h4 style={styles.centerContent}>Consulta tu perfil de 5 Tenedores</Text>
            <Text h5 style={styles.centerContent}>¿Cómo describirias tu mejor restaurante? Busca y visualiza los mejores restaurantes de una forma sencilla, vota cual te ha gustado más y comenta como ha sido tu experiencia</Text>
            <View style={styles.centerContent}>
                <Button
                    title="Ver tu Perfil"
                    buttonStyle={styles.btn}
                    onPress={() => navigation.navigate("login")}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollBody: {
        paddingHorizontal: 30
    },
    image: {
        width: "100%",
        height: 300,
        marginVertical: 30
    },
    centerContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginVertical: 5
    },
    btn: {
        backgroundColor: "#00a680",
        paddingHorizontal: 20
    }
})