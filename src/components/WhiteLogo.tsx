import React from 'react'
import { View, Text, Image } from 'react-native'

const WhiteLogo = () => {
    return (
        <View style={{
            alignItems:'center',
        }}>
            <Image 
                source={require('../assets/react-logo-white.png')}
                style={{
                    width:110,
                    height:100,
                }}
            />
        </View>
    )
}

export default WhiteLogo
