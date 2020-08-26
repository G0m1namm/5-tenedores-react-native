import React from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import { Avatar, Text } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import fb from '../../utils/firebase'

const { width } = Dimensions.get("window");
const MAX_WiDTH = width - 150;

function InfoUser({ userInfo, toastRef, setLoading, setLoaderText }) {
    const { uid, photoURL, email, displayName } = userInfo;

    const onChangeAvatar = async () => {
        const resultPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const resultCameraPermission = resultPermissions.permissions.cameraRoll.status;

        if (resultCameraPermission === "denied") {
            toastRef.current.show("Es necesario aceptar los permisos de la galería");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })

            if (result.cancelled) {
                toastRef.current.show("Has cerrado la galeria de imagenes");
            } else {
                try {
                    setLoaderText("Actualizando avatar");
                    setLoading(true);
                    await uploadImage(result.uri);
                    await fb.uploadPhotoURL(uid)
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    toastRef.current.show("Error al subir el avatar")
                }
            }
        }
    }

    const uploadImage = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        return fb.putUserAvatar(uid, blob);
    }

    return (
        <View style={styles.container}>
            <Avatar
                rounded
                size="large"
                showEditButton
                onEditPress={onChangeAvatar}
                containerStyle={styles.avatarContainer}
                source={photoURL ? { uri: photoURL } : require("../../../assets/img/avatar-default.jpg")}
            />
            <View style={styles.maxWidth}>
                <Text h4 ellipsizeMode="tail" numberOfLines={1}>{displayName}</Text>
                <Text>{email}</Text>
            </View>
        </View>
    )
}

export default InfoUser

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 20
    },
    avatarContainer: {
        margin: 10,
    },
    maxWidth: {
        maxWidth: MAX_WiDTH,
    }
})
