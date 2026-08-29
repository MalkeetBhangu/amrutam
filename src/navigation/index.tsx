import React, { useCallback } from "react"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { enableFreeze } from "react-native-screens"
import * as SplashScreen from "expo-splash-screen"
import { Screens } from "src/constants/Screens"
import colors from "src/tokens/Colors"
import { useUserState } from "src/store/UseUserStore"
import Login from "@src/components/home"
import TabNavigator from "./TabNavigator"
const { LOGIN, MAIN_TABS } = Screens
enableFreeze(true)

const MainStack = createNativeStackNavigator<any>()

const navigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: colors.screenBackground,
    },
}

const Navigation: React.FC = () => {
    const handleNavigationReady = useCallback(() => {
        SplashScreen.hideAsync()
    }, [])

    return (
        <NavigationContainer theme={navigationTheme} onReady={handleNavigationReady}>
            <MainStack.Navigator initialRouteName={MAIN_TABS} screenOptions={{ headerShown: false, navigationBarHidden: true }}>
                <MainStack.Screen name={MAIN_TABS} component={TabNavigator} />
            </MainStack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
