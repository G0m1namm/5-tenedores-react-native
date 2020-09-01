import React from 'react'
import RNCarousel from 'react-native-snap-carousel'
import { Image } from 'react-native-elements'

export default function Carousel({ arrayImages, height, width }) {

    const renderItem = ({ item }) => {
        return (
            <Image
                style={{ height, width }}
                source={{ uri: item }}
            />
        )
    }

    return (
        <RNCarousel
            layout="default"
            data={arrayImages}
            sliderWidth={width}
            itemWidth={width}
            sliderHeight={height}
            renderItem={renderItem}
        />
    )
}