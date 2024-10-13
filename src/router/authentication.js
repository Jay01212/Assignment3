import { ref } from 'vue';

const isAuthenticated = ref(false);
const isAdmin = ref(false);

export function useAuthentication() {
  const setAuthStatus = (status, adminStatus = false) => {
    isAuthenticated.value = status;
    isAdmin.value = adminStatus;
  };

  const logout = () => {
    isAuthenticated.value = false;
    isAdmin.value = false;
  };

  return {
    isAuthenticated,
    isAdmin,
    setAuthStatus,
    logout
  };
}