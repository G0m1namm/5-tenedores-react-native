import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { Overlay } from 'react-native-elements'

const Loading = ({ isVisible = false, text }) => {
    return (
        <Overlay
            {...{ isVisible }}
            windowBackgroundColor="rgba(255,255,255, 0.3)"
            overlayBackgroundColor="transparent"
            overlayStyle={styles.overlay}
            fullScreen={true}
            animationType="fade"
        >
            <View style={styles.box}>
                <ActivityIndicator size="large" color="#00a680" />
                {text && <Text style={styles.text}>{text}</Text>}
            </View>
        </Overlay>
    )
}

export default Loading

const styles = StyleSheet.create({
    overlay: {
        justifyContent: "center",
        alignContent: "center",
    },
    box: {
        flex: 1,
        flexShrink: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        color: "#00a680"
    }
})
