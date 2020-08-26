import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Overlay } from 'react-native-elements'

function Modal({ isVisible, setIsVisible, children }) {

    const closeModal = () => setIsVisible(false)
    return (
        <Overlay
            {...{ isVisible }}
            onBackdropPress={closeModal}
            overlayBackgroundColor="transparent"
            windowBackgroundColor="rgba(0,0,0,0.5)"
            overlayStyle={styles.overlay}
        >
            {children}
        </Overlay>
    )
}

export default Modal

const styles = StyleSheet.create({
    overlay: {
        height: "auto",
        marginHorizontal: 30,
        backgroundColor: "#fff"
    }
})
