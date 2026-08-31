import React, { useCallback, useEffect } from "react"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { enableFreeze } from "react-native-screens"
import * as SplashScreen from "expo-splash-screen"
import { Screens } from "src/constants/Screens"
import colors from "src/tokens/Colors"
import { useUserState } from "src/store/UseUserStore"
import { useCreateUser } from "src/apis/useCreateUser"
import Login from "src/components/login"
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
    const { userData } = useUserState()

    const handleNavigationReady = useCallback(() => {
        SplashScreen.hideAsync()
    }, [])

    return (
        <NavigationContainer theme={navigationTheme} onReady={handleNavigationReady}>
            <MainStack.Navigator initialRouteName={userData.userId ? MAIN_TABS : LOGIN} screenOptions={{ headerShown: false, navigationBarHidden: true }}>
                <MainStack.Screen name={LOGIN} component={Login} />
                <MainStack.Screen name={MAIN_TABS} component={TabNavigator} />
            </MainStack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
