import * as ReactNavigation from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Screens } from '@src/constants/Screens'
import { Doctor } from '@src/types/DoctorTypes'
import { ProductItem } from '@src/types/ProductTypes'

const { HOME, DOCTOR_DETAILS, DOCTORS, CART, PRODUCT_DETAIL } = Screens

export type ParamsList = {
    [HOME]: | undefined
    [DOCTOR_DETAILS]: { doctor: Doctor }
    [DOCTORS]: undefined
    [CART]: undefined
    [PRODUCT_DETAIL]: { product: ProductItem }
}

export default function useNavigation() {
    return ReactNavigation.useNavigation<StackNavigationProp<ParamsList>>()
}
