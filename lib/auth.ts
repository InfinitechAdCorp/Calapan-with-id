export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  role: "citizen" | "admin" | "super_admin" | "emergency_responder" | "department_staff"
  address: string
  barangay: string
  is_approved: boolean
  created_at: string
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export function logout() {
  if (typeof window === "undefined") return

  localStorage.removeItem("token")
  localStorage.removeItem("user")
  window.location.href = "/login"
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function hasRole(role: User["role"]): boolean {
  const user = getUser()
  return user?.role === role
}
