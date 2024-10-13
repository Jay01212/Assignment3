<template>
  <div class="login-page d-flex flex-column justify-content-center align-items-center min-vh-100 bg-white py-4">
    <h2 class="text-dark fs-1 mb-4">{{ isLoginView ? 'Log Into Your Account' : 'Enter Password' }}</h2>
    <div class="login-container bg-white rounded shadow-sm p-4 w-100 max-w-md">
      <form @submit.prevent="handleSubmit" class="login-form">
        <input v-model="userId" v-if="isLoginView" type="text" class="form-control mb-3" placeholder="User ID*"
          required>

        <!-- selecting roles -->
        <select v-model="selectedRole" v-if="isLoginView" class="form-control mb-3" required>
          <option value="" disabled>Select Role*</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <input v-model="password" v-if="!isLoginView" type="password" class="form-control mb-3" placeholder="Password*"
          required>
        <p class="text-end mb-3 small" v-if="isLoginView">
          <router-link to="/forgot-user-id" class="text-muted text-decoration-none">Forgot User ID?</router-link>
        </p>
        <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="isSubmitting">{{ isLoginView ? 'Next' :
          'Login' }}</button>
      </form>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
      <div class="social-login mt-4" v-if="isLoginView">
        <button @click="loginWithGoogle" class="btn btn-outline-secondary w-100 mb-2">
          <i class="fab fa-google"></i> Continue with Google
        </button>
        <button @click="loginWithFacebook" class="btn btn-outline-primary w-100">
          <i class="fab fa-facebook"></i> Continue with Facebook
        </button>
      </div>
      <p class="mt-4 text-muted" v-if="isLoginView">
        Don't have an account? <router-link to="/register" class="text-danger text-decoration-none">Get started
          now!</router-link>
      </p>
    </div>

    <!-- Footer Section -->
    <FooterComponent />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthentication } from '../router/authentication'
import FooterComponent from '../components/FooterComponent.vue'
import DOMPurify from 'dompurify'

export default {
  name: 'LoginPage',
  components: {
    FooterComponent
  },
  setup() {
    const router = useRouter()
    const { setAuthentication } = useAuthentication()
    const isLoginView = ref(true)
    const userId = ref('')
    const selectedRole = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const isSubmitting = ref(false)

    const sanitizeInput = (input) => {
      return DOMPurify.sanitize(input)
    }

    const handleSubmit = () => {
      isSubmitting.value = true
      const users = JSON.parse(localStorage.getItem('users') || '[]')

      // Hard-coded user data for testing
      // const users = [
      //   { userId: 'admin', password: '123456', userType: 'admin' },
      //   { userId: 'user', password: '123456', userType: 'user' }
      // ]

      // Sanitize inputs
      const sanitizedUserId = sanitizeInput(userId.value)
      const sanitizedRole = sanitizeInput(selectedRole.value)
      const sanitizedPassword = sanitizeInput(password.value)

      if (isLoginView.value) {
        const existingUser = users.find(user => user.userId === sanitizedUserId && user.userType === sanitizedRole)

        if (existingUser) {
          isLoginView.value = false
          errorMessage.value = ''
        } else {
          errorMessage.value = 'User ID not found or role mismatch. Please try again.'
        }
      } else {
        const validUser = users.find(user => user.userId === sanitizedUserId && user.password === sanitizedPassword && user.userType === sanitizedRole)

        if (validUser) {
          alert('Login successful!')
          setAuthentication(true)

          // Jump to different pages according to user roles
          if (validUser.userType === 'admin') {
            router.push({ name: 'About' })
          } else {
            router.push({ name: 'Home' })
          }
          errorMessage.value = ''
        } else {
          errorMessage.value = 'Invalid User ID, Password, or Role. Please try again.'
        }
      }
      isSubmitting.value = false
    }

    return {
      isLoginView,
      userId,
      selectedRole,
      password,
      errorMessage,
      handleSubmit,
      isSubmitting
    }
  }
}
</script>

<style scoped>
.max-w-md {
  max-width: 28rem;
}
</style>
