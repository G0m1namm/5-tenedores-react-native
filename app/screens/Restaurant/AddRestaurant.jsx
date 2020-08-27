import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input, Icon, Avatar } from 'react-native-elements'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import Toast from 'react-native-easy-toast'
import { map, size } from 'lodash'

function AddRestaurant() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const toastRef = useRef(null);

    return (
        <ScrollView style={{ height: "100%", paddingHorizontal: 30, marginTop: 20 }}>
            <AddForm {...{ setName, setAddress, setDescription }} />
            <UploadImage {...{ setImages, toastRef, images }} />
            <Toast ref={toastRef} position="bottom" opacity={0.8} />
        </ScrollView>
    )
}

export default AddRestaurant

export const AddForm = ({ setName, setAddress, setDescription }) => {
    return (
        <View>
            <Input
                placeholder="Nombre del restaurante"
                onChange={e => setName(e.nativeEvent.text)}
                containerStyle={styles.inputGap}
            />
            <Input
                placeholder="Dirección del restaurante"
                onChange={e => setAddress(e.nativeEvent.text)}
                containerStyle={styles.inputGap}
            />
            <Input
                placeholder="Descripción"
                onChange={e => setDescription(e.nativeEvent.text)}
                multiline
                numberOfLines={4}
                containerStyle={styles.inputGap}
            />
        </View>
    )
}

export const UploadImage = ({ toastRef, setImages, images }) => {

    const onUploadImage = async () => {
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
                setImages(prev => [...prev, result.uri]);
            }
        }
    }

    return (
        <View style={styles.imagesContainer}>
            {map(images, (image, index) => (
                <Avatar
                    key={index}
                    source={{ uri: image }}
                    containerStyle={{ height: 70, width: 70, margin: 5 }}
                />
            ))}
            {(size(images) < 4) &&
                <TouchableOpacity
                    onPress={onUploadImage}
                >
                    <Icon
                        type="material-community"
                        name="camera"
                        containerStyle={styles.cameraIcon}
                    />
                </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    inputGap: {
        marginVertical: 7
    },
    cameraIcon: {
        height: 70,
        width: 70,
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "#c1c1c1",
        margin: 5,
    },
    imagesContainer: {
        alignContent: "center",
        flexDirection: "row"
    }
})
