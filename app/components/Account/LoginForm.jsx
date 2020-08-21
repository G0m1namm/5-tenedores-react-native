import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements'
import { isEmpty, size } from 'lodash'
import { validateEmail } from '../../utils/validator'
import { useNavigation } from '@react-navigation/native'
import fb from '../../utils/firebase'
import Loading from '../Loading'

function LoginForm({ toastRef }) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", pass: "" });
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const onChangeInput = (e, type) => {
        setFormData({ ...formData, [type]: e?.nativeEvent.text })
    }

    const onSubmit = async () => {
        if (isEmpty(formData.email) || isEmpty(formData.pass)) {
            toastRef.current.show("Todos los campos son requeridos");
        } else if (!validateEmail(formData.email)) {
            toastRef.current.show("Ingrese un email válido");
        } else if (size(formData.pass) < 6) {
            toastRef.current.show("La contraseña debe tener mas de 6 caracteres", 700);
        } else {
            setLoading(true)
            try {
                await fb.login(formData.email, formData.pass)
                setLoading(false);
                navigation.navigate("account")
            } catch (error) {
                setLoading(false)
                toastRef.current.show("Error al iniciar sesión, verifique los datos e intente de nuevo", 700);
            }
        }
    }

    return (
        <View>
            <Input
                placeholder="Correo electrónico"
                containerStyle={styles.inputForm}
                textContentType="emailAddress"
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={{ color: "#c1c1c1" }}
                    />
                }
                onChange={(e) => onChangeInput(e, "email")}
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
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
                onChange={(e) => onChangeInput(e, "pass")}
            />
            <Button
                title="Iniciar sesión"
                buttonStyle={{ backgroundColor: "#00a680" }}
                containerStyle={{ marginTop: 30 }}
                onPress={onSubmit}
            />
            <Loading isVisible={loading} text="Iniciando sesión" />
        </View>
    )
}

export default LoginForm

const styles = StyleSheet.create({
    inputForm: {
        marginVertical: 7,
        flex: 1,
    }
})
