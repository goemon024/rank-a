'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { UserPayload } from '../types/auth'

// export enum Role {
//     Student = "Student",
//     Admin = "Admin"
//   }

//   export type UserPayload = {
//     userId: string
//     username: string
//     imagePath: string
//     role: Role
//     exp: number
//   }


type AuthContextType = {
    user: UserPayload | null
    isAuthenticated: boolean
    logout: () => void
    setUser: (user: UserPayload | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserPayload | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const decoded: UserPayload = jwtDecode(token)
                console.log('decoded token:', decoded)

                // 有効期限確認
                if (decoded.exp * 1000 > Date.now()) {
                    setUser(decoded)
                } else {
                    localStorage.removeItem('token')
                }
            } catch (err) {
                console.error('Invalid token', err)
                localStorage.removeItem('token')
            }
        }
    }, [])

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
