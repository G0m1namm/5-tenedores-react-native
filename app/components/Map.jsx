import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapView from 'react-native-maps'
import openMap from 'react-native-open-maps'

export default function Map({ height, name, location }) {

    const handleOpenMap = () => {
        openMap({
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: 19,
            query: name
        })
    }

    return (
        <MapView
            style={{ height, width: "100%" }}
            initialRegion={location}
            onPress={handleOpenMap}
        >
            <MapView.Marker
                coordinate={{
                    longitude: location.longitude,
                    latitude: location.latitude
                }}
            />
        </MapView>
    )
}

const styles = StyleSheet.create({})
