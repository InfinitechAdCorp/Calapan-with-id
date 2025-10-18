"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
  phone: string
  address: string
  created_at?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<User>) => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  address?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setIsLoading(false)
        return
      }

      // Verify token and get user data
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        // Token invalid, clear it
        localStorage.removeItem("auth_token")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      localStorage.removeItem("auth_token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store token
      localStorage.setItem("auth_token", data.token)
      
      // Set user data
      setUser(data.user)

      // Redirect to home
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (registerData: RegisterData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // Store token
      localStorage.setItem("auth_token", data.token)
      
      // Set user data
      setUser(data.user)

      // Redirect to home
      router.push("/")
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
    router.push("/login")
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      const token = localStorage.getItem("auth_token")
      
      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Update failed")
      }

      // Update local user state
      setUser(data.user)
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}