import React from 'react'
import { StyleSheet, View } from 'react-native'
import colors from 'src/tokens/Colors'

const Home = () => {
    return <View style={styles.container} />
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
})

export default Home