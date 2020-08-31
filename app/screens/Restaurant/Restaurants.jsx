import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import fb from '../../utils/firebase'
import { Icon } from 'react-native-elements';
import { map } from 'lodash';
import ListRestaurants from './ListRestaurants';

const LIMIT_SIZE = 7;

export default function Restaurants({ navigation }) {
    const [user, setUser] = useState(null);
    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [startRestaurant, setStartRestaurant] = useState(null);
    const [restaurants, setRestaurants] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fb.auth.onAuthStateChanged(userInfo => {
            setUser(userInfo)
        })
    }, [])

    useEffect(() => {
        getTotalRestaurantsLength();
        getRestaurants();
    }, [])

    const getTotalRestaurantsLength = () => {
        fb.getCollectionData("restaurants")
            .then((snapshot) => {
                setTotalRestaurants(snapshot.size)
            });
    }

    const getRestaurants = () => {
        fb.db.collection("restaurants")
            .orderBy("createAt", "desc")
            .limit(LIMIT_SIZE)
            .get()
            .then(response => {
                setStartRestaurant(response.docs[response.docs.length - 1])

                const arrayRestaurants = map(response.docs, (doc) => {
                    const restaurant = doc.data();
                    restaurant.id = doc.id;
                    return restaurant;
                })
                setRestaurants(arrayRestaurants);
            })
    }

    const handleLoadMore = () => {
        restaurants.length < totalRestaurants && setIsLoading(true);

        fb.db.collection("restaurants")
            .orderBy("createAt", "desc")
            .startAfter(startRestaurant.data().createAt)
            .limit(LIMIT_SIZE)
            .get()
            .then((response) => {
                if (response.docs.length > 0) {
                    setStartRestaurant(response.docs[response.docs.length - 1])
                } else {
                    setIsLoading(false);
                }

                const arrayRestaurants = map(response.docs, (doc) => {
                    const restaurant = doc.data();
                    restaurant.id = doc.id;
                    return restaurant;
                })

                setRestaurants(prev => [...prev, ...arrayRestaurants]);
            })
    }

    return (
        <View style={styles.viewBody}>
            <ListRestaurants restaurants={restaurants} />
            {user &&
                <Icon
                    type="material-community"
                    name="plus"
                    color="#00a680"
                    reverse
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate("add-restaurant")}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
    },
    btnContainer: {
        position: "absolute",
        bottom: 16,
        right: 16,
    }
})