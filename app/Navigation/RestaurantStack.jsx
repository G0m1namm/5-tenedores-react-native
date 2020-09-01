import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Restaurants from '../screens/Restaurant/Restaurants';
import AddRestaurant from '../screens/Restaurant/AddRestaurant';
import RestaurantView from '../screens/Restaurant/RestaurantView';

const Stack = createStackNavigator();

export default function RestaurantStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="restaurants"
                component={Restaurants}
                options={{
                    title: "Restaurantes"
                }}
            />
            <Stack.Screen
                name="add-restaurant"
                component={AddRestaurant}
                options={{
                    title: "Añadir restaurante"
                }}
            />
            <Stack.Screen
                name="restaurant-view"
                component={RestaurantView}
            />
        </Stack.Navigator>
    )
}
