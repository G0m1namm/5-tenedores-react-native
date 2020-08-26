import React, { useState, useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements'
import fb from '../../utils/firebase'
import { RefreshCompProvider } from '../../screens/Account/UserLogged'
import { validateEmail } from '../../utils/validator'
import { isEqual, size } from 'lodash'

function ChangePasswordForm({ setShowModal, toastRef }) {
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ actualPass: "", newPass: "", confNewPass: "" });
    const [showPassword, setShowPassword] = useState({ actualPass: false, newPass: false, confNewPass: false });
    const [btnLoading, setBtnLoading] = useState(false);
    const { setRefresh } = useContext(RefreshCompProvider);

    const onChangeInput = (e, type) => {
        setFormData({ ...formData, [type]: e?.nativeEvent.text })
    }

    const onShowPassword = (type) => {
        setShowPassword({ ...showPassword, [type]: !showPassword[type] })
    }

    const onSubmit = async () => {
        let errorsTemp = {};

        setError(null);
        if (!formData.actualPass || !formData.newPass || !formData.confNewPass) {
            errorsTemp = {
                actualPass: !formData.actualPass ? "La contraseña no puede estar vacia" : "",
                newPass: !formData.newPass ? "La contraseña no puede estar vacia" : "",
                confNewPass: !formData.confNewPass ? "La contraseña no puede estar vacia" : "",
            }
            setError(errorsTemp);
        } else if (!isEqual(formData.newPass, formData.confNewPass)) {
            errorsTemp = {
                newPass: "Las contraseñas no son iguales",
                confNewPass: "Las contraseñas no son iguales"
            }
            setError(errorsTemp);
        } else if (size(formData.newPass) < 6) {
            errorsTemp = {
                newPass: "La contraseña tiene que ser mayor a 6 caracteres",
                confNewPass: "La contraseña tiene que ser mayor a 6 caracteres"
            }
            setError(errorsTemp);
        } else {
            setBtnLoading(true);
            await tryUpdatePassword();
            setBtnLoading(false);
            if (error) {
                setRefresh(prev => !prev);
                setShowModal(false);
            }
        }
    }

    const tryUpdatePassword = async () => {
        try {
            await fb.getUserInfo().updatePassword(formData.newPass)
            toastRef.current.show("Contraseña actualizada");
            await tryReAuth();
        } catch (error) {
            setBtnLoading(false);
            toastRef.current.show("Error al actualizar la información");
            console.log("cosas 2", error);
        }
    }

    const tryReAuth = async () => {
        try {
            await fb.reAuthenticate(formData.newPass);
            await fb.logout();
        } catch (error) {
            setError({ actualPass: "La contraseña no es correcta" });
        }
    }

    return (
        <View style={styles.container}>
            <Input
                autoFocus
                placeholder="Contraseña actual"
                password={true}
                secureTextEntry={!showPassword.actualPass}
                passwordRules="minlength:6"
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword.actualPass ? "eye-off-outline" : "eye-outline"}
                        iconStyle={{ color: "#c1c1c1" }}
                        onPress={() => onShowPassword("actualPass")}
                        hitSlop={{ bottom: 7, right: 7, left: 7, top: 7 }}
                    />
                }
                onChange={e => onChangeInput(e, "actualPass")}
                errorMessage={error?.actualPass}
            />
            <Input
                placeholder="Nueva contraseña"
                password={true}
                secureTextEntry={!showPassword.newPass}
                passwordRules="minlength:6"
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword.newPass ? "eye-off-outline" : "eye-outline"}
                        iconStyle={{ color: "#c1c1c1" }}
                        onPress={() => onShowPassword("newPass")}
                        hitSlop={{ bottom: 7, right: 7, left: 7, top: 7 }}
                    />
                }
                onChange={e => onChangeInput(e, "newPass")}
                errorMessage={error?.newPass}
            />
            <Input
                placeholder="Repetir nueva contraseña"
                password={true}
                secureTextEntry={!showPassword.confNewPass}
                passwordRules="minlength:6"
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword.confNewPass ? "eye-off-outline" : "eye-outline"}
                        iconStyle={{ color: "#c1c1c1" }}
                        onPress={() => onShowPassword("confNewPass")}
                        hitSlop={{ bottom: 7, right: 7, left: 7, top: 7 }}
                    />
                }
                onChange={e => onChangeInput(e, "confNewPass")}
                errorMessage={error?.confNewPass}
            />
            <Button
                title="Cambiar contraseña"
                containerStyle={{ marginTop: 20 }}
                buttonStyle={styles.btnStyle}
                onPress={onSubmit}
                loading={btnLoading}
            />
        </View>
    )
}

export default ChangePasswordForm

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    btnStyle: {
        backgroundColor: "#00a680"
    }
})
