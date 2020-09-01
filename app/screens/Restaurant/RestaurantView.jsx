import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import fb from '../../utils/firebase'
import Loading from '../../components/Loading'
import Carousel from '../../components/Carousel'

const screenWidth = Dimensions.get("window").width;

export default function RestaurantView({ navigation, route }) {
    const { id, name } = route.params;
    navigation.setOptions({ title: name })

    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        fb.getCollectionDataById("restaurants", id)
            .then((response) => {
                let data = response.data();
                data.id = response.id;
                setRestaurant(data);
            })
    }, [])

    if (!restaurant) return <Loading isVisible={true} text="Cargando..." />

    return (
        <ScrollView style={styles.scrollBody}>
            <Carousel
                arrayImages={restaurant.images}
                height={200}
                width={screenWidth}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollBody: {
        flex: 1
    }
})
