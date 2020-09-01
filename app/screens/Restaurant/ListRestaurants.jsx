import React from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { size } from 'lodash'
import Loading from '../../components/Loading'
import { Image } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

export default function ListRestaurants({ restaurants, handleLoadMore, isLoading }) {
    const navigation = useNavigation();

    return (
        <View>
            {(size(restaurants) > 0) ?
                (
                    <FlatList
                        data={restaurants}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(item) => <Restaurant restaurant={item} navigation={navigation} />}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={<FooterList isLoading={isLoading} />}
                        onEndReached={handleLoadMore}
                    />
                ) : (<Loading isVisible={true} text="Cargando restaurantes..." />)
            }
        </View>
    )
}

const Restaurant = ({ restaurant, navigation }) => {
    const { images, id, name, address, description } = restaurant.item;
    const imageRestaurant = images[0];

    const goToRestaurants = () => {
        navigation.navigate("restaurant-view", { id, name });
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

const FooterList = ({ isLoading }) => {
    if (isLoading) {
        return (
            <View style={styles.footerList}>
                <ActivityIndicator />
            </View>
        )
    } else {
        return (
            <View style={styles.footerList}>
                <Text>No quedan restarantes por cargar</Text>
            </View>
        )
    }
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
    },
    footerList: {
        margin: 10,
        alignItems: "center"
    }
})
