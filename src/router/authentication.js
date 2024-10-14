import { ref } from 'vue'

export function useAuthentication() {
  const isAuthenticated = ref(false)
  const isAdmin = ref(false)

  const setAuthStatus = (authStatus, adminStatus) => {
    isAuthenticated.value = authStatus
    isAdmin.value = adminStatus
  }

  const logout = () => {
    isAuthenticated.value = false
    isAdmin.value = false
  }

  return {
    isAuthenticated,
    isAdmin,
    setAuthStatus,
    logout
  }
}