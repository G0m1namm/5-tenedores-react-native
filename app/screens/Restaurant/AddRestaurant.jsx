import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, Alert, Image, Dimensions, Button as Btn } from 'react-native'
import { Input, Icon, Avatar, Button } from 'react-native-elements'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import MapView from 'react-native-maps'
import Toast from 'react-native-easy-toast'
import { map, size, filter, isEqual } from 'lodash'
import Modal from '../../components/Modal'
import fb from '../../utils/firebase'
import uuid from 'random-uuid-v4'
import Loading from '../../components/Loading'
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get("window");

function AddRestaurant() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const toastRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const baseDataAtCreation = {
        rating: 0,
        ratingTotal: 0,
        quantityVoting: 0,
        createdBy: fb.getUserInfo().uid,
    }

    const verifyBeforeSend = () => {
        let isError = true;

        if (!name || !address || !description) {
            toastRef.current.show("Los datos no pueden estar vacios")
        } else if (size(images) === 0) {
            toastRef.current.show("Debes seleccionar al menos una imagen")
        } else if (!locationRestaurant) {
            toastRef.current.show("Debes seleccionar la ubicación del restaurante en el mapa")
        } else {
            isError = false;
        }

        return isError;
    }

    const onSendInfo = async () => {
        if (!verifyBeforeSend()) {
            setIsLoading(true);
            try {
                const urls = await uploadImageToStorage();
                await fb.saveCollectiondata("restaurants", {
                    name,
                    address,
                    description,
                    images,
                    location: locationRestaurant,
                    createAt: new Date(),
                    ...baseDataAtCreation
                })
                setIsLoading(false);
                navigation.navigate("restaurants");
            } catch (error) {
                setIsLoading(false);
                toastRef.current.show("Error al crear el restaurante, intende de nuevo")
            }
        }
    }

    const uploadImageToStorage = async () => {
        const arrayUrl = [];

        await Promise.all(
            map(images, async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const name = uuid();

                const ref = fb.getStorageRef("restaurants").child(name);
                await ref.put(blob).then(async (result) => {
                    await fb.getStorageRef(`restaurants/${name}`).getDownloadURL()
                        .then(photoURL => {
                            arrayUrl.push(photoURL);
                        })
                })
            })
        )

        return arrayUrl;
    }

    return (
        <ScrollView style={{ height: "100%" }}>
            <Image
                style={{ width, height: 200 }}
                source={images[0] ? { uri: images[0] } : require("../../../assets/img/no-image.png")}
            />
            <View style={{ marginHorizontal: 30, marginTop: 20 }}>
                <AddForm {...{ setName, setAddress, setDescription, setIsVisible }} />
                <UploadImage {...{ setImages, toastRef, images }} />
                <Button title="Crear" onPress={onSendInfo} />
                <Toast ref={toastRef} position="top" opacity={0.8} />
                <Map {...{ isVisible, setIsVisible, toastRef, setLocationRestaurant }} />
                <Loading isVisible={isLoading} text="Creando restaurante..." />
            </View>
        </ScrollView>
    )
}

export default AddRestaurant

const AddForm = ({ setName, setAddress, setDescription, setIsVisible }) => {
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
                rightIcon={<Icon
                    type="material-community"
                    name="google-maps"
                    color="#c2c2c2"
                    onPress={() => setIsVisible(prev => !prev)}
                />}
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

const UploadImage = ({ toastRef, setImages, images }) => {

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

    const deleteAvatar = (selectedImage) => {
        const arrImages = [...images];

        Alert.alert(
            "Eliminar imágen",
            "¿Estás seguro de que quieres eliminar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Eliminar", onPress: () => {
                        setImages(
                            filter(arrImages, (image) => !isEqual(image, selectedImage))
                        )
                    }
                }
            ],
            { cancelable: false }
        );
    }

    return (
        <View style={styles.imagesContainer}>
            {map(images, (image, index) => (
                <Avatar
                    key={index}
                    source={{ uri: image }}
                    containerStyle={{ height: 70, width: 70, margin: 5 }}
                    onPress={() => deleteAvatar(image)}
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

const Map = ({ isVisible, setIsVisible, toastRef, setLocationRestaurant }) => {
    const [location, setLocation] = useState(null);

    const onSaveLocation = () => {
        setLocationRestaurant(location);
        setIsVisible(false);
        toastRef.current.show("Ubicación guardada correctamente", 1000);
    }

    useEffect(() => {
        (async () => {
            const resultPermissions = await Permissions.askAsync(Permissions.LOCATION);
            const resultCameraPermission = resultPermissions.permissions.location.status;

            if (!isEqual(resultCameraPermission, "granted")) {
                toastRef.current.show("Se necesitan los permisos de localización para crear el restaurante");
            } else {
                const geoLocation = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: geoLocation.coords.latitude,
                    longitude: geoLocation.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })
            }
        })()
    }, []);

    return (
        <Modal {...{ isVisible, setIsVisible }}>
            <View>
                {location &&
                    <MapView
                        showsUserLocation
                        style={{ width: "100%", height: 550 }}
                        initialRegion={location}
                        onRegionChange={region => setLocation(region)}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                }
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Button
                        title="Cancelar"
                        containerStyle={styles.btnContainer}
                        buttonStyle={{ backgroundColor: "#fff" }}
                        titleStyle={{ color: "#00a680" }}
                        onPress={() => setIsVisible(false)}
                    />
                    <Button
                        title="Guardar ubicación"
                        containerStyle={styles.btnContainer}
                        buttonStyle={{ backgroundColor: "#00a680" }}
                        onPress={onSaveLocation}
                    />
                </View>
            </View>
        </Modal>
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
    },
    btnContainer: {
        margin: 5,
        flex: 1,
    }
})
