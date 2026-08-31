import { useMutation } from '@tanstack/react-query'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL


export interface CreateUserResponse {
    success: boolean
    data?: { userId: string }
}



export const createUser = async (): Promise<CreateUserResponse> => {
    const url = `${BASE_URL}/users`

    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
    const data = await response.json()
    return data
}



export const useCreateUser = () => {

    return useMutation({
        mutationFn: createUser,
        onSuccess: (data) => {
            console.log('Successfully created user in mutation:', data)
        },
        onError: (error) => {
            console.error('Error creating user:', error)
        },
    })
}

export default useCreateUser
