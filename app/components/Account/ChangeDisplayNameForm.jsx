import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input, Button } from 'react-native-elements'
import fb from '../../utils/firebase'
import { RefreshCompProvider } from '../../screens/Account/UserLogged'

function ChangeDisplayName({ setShowModal, toastRef, displayName }) {
    const [error, setError] = useState(null);
    const [newDisplayName, setNewDisplayName] = useState(null);
    const [btnLoading, setBtnLoading] = useState(false);
    const { setRefresh } = useContext(RefreshCompProvider);

    const onSubmit = async () => {
        setError(null);
        if (!newDisplayName && !displayName) {
            setError("El campo no puede estar vacío");
        } else if (newDisplayName === displayName) {
            setError("El nombre no puede ser igual al actual");
        } else if (!newDisplayName && displayName) {
            return;
        } else {
            try {
                setBtnLoading(true);
                const data = { displayName: newDisplayName };
                await fb.getUserInfo().updateProfile(data);
                setBtnLoading(false);
                setRefresh(prev => !prev);
                setShowModal(false);
                toastRef.current.show("Nombre actualizado");
            } catch (error) {
                setBtnLoading(false);
                setRefresh(prev => !prev);
                setShowModal(false);
                toastRef.current.show("Error al actualizar la información");
            }
        }
    }

    return (
        <View style={styles.container}>
            <Input
                autoFocus
                defaultValue={displayName || ""}
                placeholder="Nombre y Apellidos"
                rightIcon={{
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#c2c2c2"
                }}
                onChange={e => setNewDisplayName(e.nativeEvent.text)}
                errorMessage={error}
            />
            <Button
                title="Cambiar nombre"
                containerStyle={{ marginTop: 20 }}
                buttonStyle={styles.btnStyle}
                onPress={onSubmit}
                loading={btnLoading}
            />
        </View>
    )
}

export default ChangeDisplayName

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    btnStyle: {
        backgroundColor: "#00a680"
    }
})
