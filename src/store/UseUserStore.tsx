import { DEFAULT_LANGUAGE_CODE } from '@src/constants/Constants'
import { localStorage, STORAGE } from 'src/localStorage/Store'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'



export interface UserType {
    userId?: string
    languageCode: string
}

interface UserState {
    userData: Partial<UserType>
    setUserData: (data: Partial<UserType>) => void
    resetUserData: () => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            userData: {
                userId: '',
                languageCode: DEFAULT_LANGUAGE_CODE
            } as Partial<UserType>,
            setUserData: (data: Partial<UserType>) =>
                set((state) => ({
                    userData: { ...state.userData, ...data }
                })),
            resetUserData: () =>
                set((state) => ({
                    userData: {
                        isLoggedIn: false
                    } as Partial<UserType>
                }))
        }),
        localStorage(STORAGE.USER)
    )
)

export const useUserState = <T extends keyof UserType>(selectors?: T[]) => {
    const userState = useUserStore((state) => state.userData)

    const userData = selectors
        ? selectors.reduce((acc, key) => {
            acc[key] = userState[key]
            return acc
        }, {} as Partial<UserType>)
        : userState

    const setUserData = useUserStore((state) => state.setUserData)
    const resetUserData = useUserStore((state) => state.resetUserData)

    return {
        userData,
        setUserData,
        resetUserData
    }
}
