import React, { useState, useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements'
import fb from '../../utils/firebase'
import { RefreshCompProvider } from '../../screens/Account/UserLogged'
import { validateEmail } from '../../utils/validator'

function ChangeEmailForm({ setShowModal, toastRef, email }) {
    const [error, setError] = useState(null);
    const [newEmail, setNewEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const { setRefresh } = useContext(RefreshCompProvider);

    const onSubmit = async () => {
        setError(null);
        if (!newEmail && !email) {
            setError({ email: "El campo no puede estar vacío" });
        } else if (newEmail === email) {
            setError({ email: "El email no puede ser igual al actual" });
        } else if (!newEmail && email) {
            return;
        } else if (!validateEmail(newEmail)) {
            setError({ email: "El email no es válido" });
        } else if (!password) {
            setError({ password: "La contraseña no puede estar vacia" });
        } else {
            setBtnLoading(true);
            await tryUpdateEmail();
        }
    }

    const tryUpdateEmail = async () => {
        try {
            await fb.getUserInfo().updateEmail(newEmail)
            toastRef.current.show("Correo electrónico actualizado");
            await tryReAuth();
        } catch (error) {
            setBtnLoading(false);
            toastRef.current.show("Error al actualizar la información");
        }
    }

    const tryReAuth = async () => {
        try {
            await fb.reAuthenticate(password);
            setBtnLoading(false);
            setRefresh(prev => !prev);
            setShowModal(false);
        } catch (error) {
            setError({ password: "La contraseña no es correcta" });
            setBtnLoading(false);
            setRefresh(prev => !prev);
            setShowModal(false);
        }
    }

    return (
        <View style={styles.container}>
            <Input
                autoFocus
                defaultValue={email || ""}
                placeholder="Correo electrónico"
                rightIcon={{
                    type: "material-community",
                    name: "at",
                    color: "#c2c2c2"
                }}
                onChange={e => setNewEmail(e.nativeEvent.text)}
                errorMessage={error?.email}
            />
            <Input
                placeholder="contraseña"
                password={true}
                secureTextEntry={!showPassword}
                passwordRules="minlength:6"
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={{ color: "#c1c1c1" }}
                        onPress={() => setShowPassword(prev => !prev)}
                        hitSlop={{ bottom: 7, right: 7, left: 7, top: 7 }}
                    />
                }
                onChange={e => setPassword(e.nativeEvent.text)}
                errorMessage={error?.password}
            />
            <Button
                title="Cambiar correo electrónico"
                containerStyle={{ marginTop: 20 }}
                buttonStyle={styles.btnStyle}
                onPress={onSubmit}
                loading={btnLoading}
            />
        </View>
    )
}

export default ChangeEmailForm

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    btnStyle: {
        backgroundColor: "#00a680"
    }
})
