'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string | number
  name?: string
  first_name?: string
  last_name?: string
  email: string
  phone?: string        // ⭐ AJOUTER
  country?: string      // ⭐ AJOUTER
  address?: string      // ⭐ AJOUTER
  role: 'admin' | 'candidat'
}
// export interface User {
//   id: string | number
//   name: string
//   email: string
//   role: 'admin' | 'candidat'
// }

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Fonction pour gérer les cookies manuellement
function setCookie(name: string, value: string, days: number) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

function getCookie(name: string): string | null {
  const nameEQ = name + "="
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        // Sync avec cookies pour le middleware
        setCookie('currentUser', savedUser, 7)
      } catch (error) {
        console.error('Erreur parsing user:', error)
        localStorage.clear()
        deleteCookie('currentUser')
      }
    }
    setIsLoading(false)
  }, [])

  const updateUser = (newUser: User | null) => {
    setUser(newUser)
    if (newUser) {
      const userStr = JSON.stringify(newUser)
      localStorage.setItem('currentUser', userStr)
      setCookie('currentUser', userStr, 7)
    } else {
      localStorage.removeItem('currentUser')
      deleteCookie('currentUser')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.clear()
    deleteCookie('currentUser')
    window.location.href = '/signin'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser doit être utilisé dans un UserProvider')
  }
  return context
}

// 'use client'

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// export interface User {
//   id: string | number
//   name: string
//   email: string
//   role: 'admin' | 'candidat'
// }

// interface UserContextType {
//   user: User | null
//   setUser: (user: User | null) => void
//   logout: () => void
//   isLoading: boolean
// }

// const UserContext = createContext<UserContextType | undefined>(undefined)

// export function UserProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   // Charger l'utilisateur au montage
//   useEffect(() => {
//     const savedUser = localStorage.getItem('currentUser')
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser))
//       } catch (error) {
//         console.error('Erreur parsing user:', error)
//         localStorage.clear()
//       }
//     }
//     setIsLoading(false)
//   }, [])

//   // Sauvegarder l'utilisateur à chaque changement
//   useEffect(() => {
//     if (!isLoading) {
//       if (user) {
//         localStorage.setItem('currentUser', JSON.stringify(user))
//       } else {
//         localStorage.removeItem('currentUser')
//       }
//     }
//   }, [user, isLoading])

//   const logout = () => {
//     setUser(null)
//     localStorage.clear()
//     window.location.href = '/signin'
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   return (
//     <UserContext.Provider value={{ user, setUser, logout, isLoading }}>
//       {children}
//     </UserContext.Provider>
//   )
// }

// export function useUser() {
//   const context = useContext(UserContext)
//   if (!context) {
//     throw new Error('useUser doit être utilisé dans un UserProvider')
//   }
//   return context
// }