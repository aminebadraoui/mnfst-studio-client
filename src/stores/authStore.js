import { create } from 'zustand'
import { toast } from 'react-toastify'

// Constants
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes in milliseconds

const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        return JSON.parse(jsonPayload)
    } catch (error) {
        return null
    }
}

const handleApiError = (error) => {
    if (error.message.includes('401')) {
        return 'Session expired. Please sign in again.'
    }
    if (error.message.includes('403')) {
        return 'You do not have permission to perform this action.'
    }
    if (error.message.includes('Network Error')) {
        return 'Unable to connect to server. Please check your internet connection.'
    }
    return error.message || 'An unexpected error occurred'
}

const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    token: null,
    tokenExpiry: null,

    fetchUserProfile: async () => {
        try {
            const response = await fetch('/api/auth/me')
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            const userData = await response.json()
            set({ user: userData })
            return userData
        } catch (error) {
            console.error('Error fetching user profile:', error)
            toast.error('Failed to fetch user profile')
            return null
        }
    },

    checkTokenExpiration: () => {
        const { token, tokenExpiry, refreshToken } = get()
        if (!token || !tokenExpiry) return

        const now = Date.now()
        if (tokenExpiry - now < TOKEN_REFRESH_THRESHOLD) {
            refreshToken()
        }
    },

    refreshToken: async () => {
        try {
            const currentToken = get().token
            if (!currentToken) return

            const response = await fetch('/api/auth/token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${currentToken}`
                }
            })

            if (!response.ok) {
                throw new Error(response.statusText)
            }

            const data = await response.json()
            const { access_token } = data
            const tokenData = parseJwt(access_token)

            if (tokenData) {
                localStorage.setItem('token', access_token)
                set({
                    token: access_token,
                    tokenExpiry: tokenData.exp * 1000 // Convert to milliseconds
                })
            }
        } catch (error) {
            console.error('Error refreshing token:', error)
            // If refresh fails, sign out
            get().signOut()
            toast.error('Session expired. Please sign in again.')
        }
    },

    signIn: async (email, password) => {
        set({ isLoading: true })
        try {
            const formData = new FormData()
            formData.append('username', email)
            formData.append('password', password)

            const response = await fetch('/api/auth/token', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.detail || 'Failed to sign in')
            }

            const data = await response.json()
            const { access_token } = data
            const tokenData = parseJwt(access_token)

            if (!tokenData) {
                throw new Error('Invalid token received')
            }

            localStorage.setItem('token', access_token)

            set({
                token: access_token,
                tokenExpiry: tokenData.exp * 1000,
                isAuthenticated: true,
                isLoading: false
            })

            // Fetch user profile
            await get().fetchUserProfile()
            return { success: true }
        } catch (error) {
            set({ isLoading: false })
            const errorMessage = handleApiError(error)
            toast.error(errorMessage)
            return { success: false, error: errorMessage }
        }
    },

    register: async (userData) => {
        set({ isLoading: true })
        try {
            const { firstName, lastName, email, password } = userData

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    password,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.detail || 'Failed to register')
            }

            const data = await response.json()
            const { access_token } = data
            const tokenData = parseJwt(access_token)

            if (!tokenData) {
                throw new Error('Invalid token received')
            }

            localStorage.setItem('token', access_token)

            set({
                token: access_token,
                tokenExpiry: tokenData.exp * 1000,
                isAuthenticated: true,
                isLoading: false
            })

            // Fetch user profile
            await get().fetchUserProfile()
            return { success: true }
        } catch (error) {
            set({ isLoading: false })
            const errorMessage = handleApiError(error)
            toast.error(errorMessage)
            return { success: false, error: errorMessage }
        }
    },

    signOut: () => {
        localStorage.removeItem('token')
        set({
            user: null,
            isAuthenticated: false,
            token: null,
            tokenExpiry: null
        })
    },

    initAuth: async () => {
        const token = localStorage.getItem('token')
        if (token) {
            const tokenData = parseJwt(token)
            if (tokenData && tokenData.exp * 1000 > Date.now()) {
                set({
                    isAuthenticated: true,
                    token,
                    tokenExpiry: tokenData.exp * 1000
                })
                // Fetch user profile
                await get().fetchUserProfile()
                // Start token refresh check
                get().checkTokenExpiration()
            } else {
                // Token expired
                get().signOut()
            }
        }
    }
}))

export default useAuthStore 