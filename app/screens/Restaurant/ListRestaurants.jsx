import React from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { size } from 'lodash'
import Loading from '../../components/Loading'
import { Image } from 'react-native-elements'

export default function ListRestaurants({ restaurants }) {
    return (
        <View>
            {(size(restaurants) > 0) ?
                (
                    <FlatList
                        data={restaurants}
                        keyExtractor={item => item.id}
                        renderItem={(item) => <Restaurant restaurant={item} />}
                    />
                ) : (<Loading isVisible={true} text="Cargando restaurantes..." />)
            }
        </View>
    )
}

const Restaurant = ({ restaurant }) => {
    const { images, name, address, description } = restaurant.item;
    const imageRestaurant = images[0];

    const goToRestaurants = () => {
        console.log("aa");
    }

    return (
        <TouchableOpacity onPress={goToRestaurants}>
            <View style={styles.restaurant}>
                <View style={styles.imageContainer}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator />}
                        source={imageRestaurant ? { uri: imageRestaurant } : require("../../../assets/img/no-image.png")}
                        style={styles.image}
                    />
                </View>
                <View>
                    <Text style={[styles.text, { fontWeight: "bold" }]}>{name}</Text>
                    <Text style={styles.text}>{address}</Text>
                    <Text style={styles.text}>{description.substring(0, 60)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    restaurant: {
        flex: 1,
        flexDirection: "row",
        marginVertical: 20,
        marginHorizontal: 10
    },
    imageContainer: {
        marginRight: 10,
    },
    image: {
        width: 80,
        height: 80
    },
    text: {
        fontSize: 16,
    }
})
