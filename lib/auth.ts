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

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function hasRole(role: User["role"]): boolean {
  const user = getUser()
  return user?.role === role
}

export async function logoutAsync() {
  if (typeof window === "undefined") return

  localStorage.removeItem("token")
  localStorage.removeItem("user")

  // Clear the auth_token cookie by setting it with an expired date
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname

  // Return true to signal successful logout
  return true
}

export function logout() {
  if (typeof window === "undefined") return

  localStorage.removeItem("token")
  localStorage.removeItem("user")

  // Clear the auth_token cookie by setting it with an expired date
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

  window.location.href = "/login"
}
