import * as ReactNavigation from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Screens } from '@src/constants/Screens'
import { Doctor } from '@src/types/DoctorTypes'

const { HOME, DOCTOR_DETAILS, DOCTORS } = Screens

export type ParamsList = {
    [HOME]: | undefined
    [DOCTOR_DETAILS]: { doctor: Doctor }
    [DOCTORS]: undefined
}

export default function useNavigation() {
    return ReactNavigation.useNavigation<StackNavigationProp<ParamsList>>()
}
