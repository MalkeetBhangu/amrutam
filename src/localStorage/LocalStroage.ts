import { UserType } from 'src/store/UseUserStore'
import { dataStorage } from './Store'

type StorageObject = {
    USER: UserType
}


export const setLocalData = <K extends keyof StorageObject>(key: K, object: Partial<StorageObject[K]>) => {
    const data = getLocalData(key) || {}
    const updatedData = { ...data, ...object }
    dataStorage.set(key, JSON.stringify(updatedData))

}

export const getLocalData = <K extends keyof StorageObject>(key: K): Partial<StorageObject[K]> | undefined => {
    const data = dataStorage.getString(key)
    if (!data) return undefined
    return JSON.parse(data) as Partial<StorageObject[K]>
}
