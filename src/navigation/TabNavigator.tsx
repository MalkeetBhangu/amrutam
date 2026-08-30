import { doctors, home, profile, records, shop } from '@assets/index'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Bookings from '@src/components/bookings/Bookings'
import Cart from '@src/components/cart'
import DoctorDetails from '@src/components/doctorDetails'
import Doctors from '@src/components/doctors'
import Home from '@src/components/home'
import Profile from '@src/components/profile'
import Records from '@src/components/records'
import Shop from '@src/components/shop'
import { getHeight } from '@src/libs/StyleHelper'
import colors from '@src/tokens/Colors'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { Screens, TABS } from 'src/constants/Screens'
import { getTexts } from 'src/translations/TranslationHelper'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator<any>()

export const HomeNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={Screens.HOME} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.HOME} component={Home} />
        </Stack.Navigator>
    )
}

const DoctorsNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={Screens.DOCTORS} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.DOCTORS} component={Doctors} />
            <Stack.Screen name={Screens.DOCTOR_DETAILS} component={DoctorDetails} />
            <Stack.Screen name={Screens.BOOKINGS} component={Bookings} />
        </Stack.Navigator>
    )
}

const ShopNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={Screens.SHOP} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.SHOP} component={Shop} />
            <Stack.Screen name={Screens.CART} component={Cart} />
        </Stack.Navigator>
    )
}

const RecordsNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={Screens.RECORDS} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.RECORDS} component={Records} />
        </Stack.Navigator>
    )
}

const ProfileNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={Screens.PROFILE} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.PROFILE} component={Profile} />
        </Stack.Navigator>
    )
}

const TabNavigator = () => {
    const t = getTexts(DEFAULT_LANGUAGE_CODE)

    const TabNames = [
        { tabIcon: home, name: TABS.HOME_TAB, screen: HomeNavigator, label: t.tabs.home },
        { tabIcon: doctors, name: TABS.DOCTORS_TAB, screen: DoctorsNavigator, label: t.tabs.doctors },
        { tabIcon: shop, name: TABS.SHOP_TAB, screen: ShopNavigator, label: t.tabs.shop },
        { tabIcon: records, name: TABS.RECORDS_TAB, screen: RecordsNavigator, label: t.tabs.records },
        { tabIcon: profile, name: TABS.PROFILE_TAB, screen: ProfileNavigator, label: t.tabs.profile }
    ]

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarHideOnKeyboard: true,
                tabBarLabelPosition: 'below-icon',
                tabBarActiveTintColor: colors.primaryGreen,
                tabBarInactiveTintColor: colors.greyColor,
                tabBarLabelStyle: styles.tabBarLabel,
            }}
        >
            {TabNames?.map((item) => {
                return (
                    <Tab.Screen
                        key={item.name}
                        options={{
                            title: item.label,
                            tabBarIcon: ({ focused }) => {
                                const Icon = item.tabIcon
                                const tintColor = focused ? colors.primaryGreen : colors.greyColor
                                return (
                                    <View style={styles.iconWrapper}>
                                        <Icon width={18} height={18} fill={tintColor} color={tintColor} />
                                    </View>
                                )
                            }
                        }}
                        name={item.name}
                        component={item.screen}
                    />
                )
            })}
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        borderTopWidth: getHeight(1),
        borderTopColor: colors.shadowColor,
        backgroundColor: colors.white,
        height: getHeight(65),
        paddingBottom: getHeight(8),
        paddingTop: getHeight(6),
        elevation: 4,
    },
    tabBarLabel: {
        fontSize: getHeight(11),
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default TabNavigator
