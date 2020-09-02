import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import fb from '../../utils/firebase'
import Loading from '../../components/Loading'
import Carousel from '../../components/Carousel'
import { Rating } from 'react-native-elements'
import Map from '../../components/Map'

const screenWidth = Dimensions.get("window").width;

export default function RestaurantView({ navigation, route }) {
    const { id, name } = route.params;
    navigation.setOptions({ title: name })

    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        fb.getCollectionDataById("restaurants", id)
            .then((response) => {
                let data = response.data();
                data.id = response.id;
                setRestaurant(data);
                setRating(data.rating);
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
            <TitleRestaurant
                name={restaurant.name}
                description={restaurant.description}
                rating={rating}
            />
            <RestaurantInfo
                name={restaurant.name}
                location={restaurant.location}
            />
        </ScrollView>
    )
}

const TitleRestaurant = ({ name, description, rating }) => {
    return (
        <View style={styles.titleContainer}>
            <View style={styles.flexLayout}>
                <Text>{name}</Text>
                <Rating
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text>{description}</Text>
        </View>
    )
}

const RestaurantInfo = ({ name, location, address }) => {
    return (
        <View>
            <Text>Información sobre el restaurante</Text>
            <Map location={location} name={name} height={100} />
        </View>
    )
}

const styles = StyleSheet.create({
    scrollBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    titleContainer: {
        marginTop: 10,
        marginHorizontal: 16
    },
    flexLayout: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between"
    }
})
