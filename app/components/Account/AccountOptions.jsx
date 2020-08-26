import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { map } from 'lodash'
import { ListItem } from 'react-native-elements'
import fb from '../../utils/firebase'
import Modal from '../Modal'
import ChangeDisplayNameForm from './ChangeDisplayNameForm'
import ChangeEmailForm from './ChangeEmailForm'
import ChangePasswordForm from './ChangePasswordForm'

function AccountOptions({ userInfo, toastRef }) {
    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);
    const { displayName, email } = userInfo;

    const selectedComponent = key => {
        switch (key) {
            case "displayName":
                setRenderComponent(
                    <ChangeDisplayNameForm
                        displayName={displayName}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                    />
                );
                setShowModal(true);
                break;
            case "email":
                setRenderComponent(
                    <ChangeEmailForm
                        email={email}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                    />
                );
                setShowModal(true);
                break;
            case "password":
                setRenderComponent(
                    <ChangePasswordForm
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                    />
                );
                setShowModal(true);
                break;

            default:
                setRenderComponent(null);
                setShowModal(false);
                break;
        }
    }

    const menuOptions = generateComponents(selectedComponent);

    return (
        <View style={styles.viewContainer}>
            {map(menuOptions, (menu, index) => (
                <ListItem
                    key={index}
                    title={menu.title}
                    leftIcon={{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColorLeft
                    }}
                    rightIcon={{
                        type: menu.iconType,
                        name: menu.iconNameRight,
                        color: menu.iconColorRight
                    }}
                    titleStyle={{
                        color: menu.titleColor
                    }}
                    onPress={menu.onPress}
                    bottomDivider
                />
            ))}
            {renderComponent &&
                <Modal isVisible={showModal} setIsVisible={setShowModal}>
                    {renderComponent}
                </Modal>
            }
        </View>
    )
}

const generateComponents = selectedComponent => {
    return [
        {
            title: "Cambiar nombre y apellidos",
            titleColor: "#000",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ddd",
            onPress: () => selectedComponent("displayName"),
        },
        {
            title: "Cambiar correo electronico",
            titleColor: "#000",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ddd",
            onPress: () => selectedComponent("email"),
        },
        {
            title: "Cambiar contraseña",
            titleColor: "#000",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ddd",
            onPress: () => selectedComponent("password"),
        },
        {
            title: "Cerrar sesión",
            titleColor: "#00a680",
            iconType: "material-community",
            iconNameLeft: "logout",
            iconColorLeft: "#00a680",
            iconNameRight: "chevron-right",
            iconColorRight: "#fff",
            onPress: () => fb.logout(),
        },
    ]
}

export default AccountOptions

const styles = StyleSheet.create({
    viewContainer: {
        marginBottom: 20
    }
})
