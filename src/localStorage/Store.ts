// import { MMKV } from 'react-native-mmkv'

// export const dataStorage = new MMKV()
export const dataStorage = {}

export enum STORAGE {
    USER = 'USER',
}

const zustandMMKVStorage = {
    getItem: (name: string) => {
        const value = dataStorage.getString(name)
        return value ? JSON.parse(value) : null
    },
    setItem: (name: string, value: any) => dataStorage.set(name, JSON.stringify(value)),
    removeItem: (name: string) => dataStorage.delete(name)
}

export const localStorage = (storeName: STORAGE) => {
    return {
        name: storeName,
        storage: zustandMMKVStorage
    }
}
