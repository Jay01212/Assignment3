<template>
  <div class="container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100 py-3">
    <div class="register-container bg-white p-4 rounded shadow-sm">
      <h2 class="text-center text-dark mb-4">Create Your Account</h2>
      <form @submit.prevent="handleSubmit" class="register-form">
        <!-- Username Field -->
        <div class="mb-3">
          <input 
            v-model="username" 
            @blur="validateUsername" 
            @input="validateUsername" 
            type="text" 
            class="form-control" 
            placeholder="Username*" 
          >
          <div v-if="errors.username" class="text-danger mt-1">{{ errors.username }}</div>
        </div>

        <!-- Gender Field -->
        <div class="mb-3">
          <select v-model="gender" class="form-select">
            <option value="" disabled selected>Select Gender*</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <div v-if="errors.gender" class="text-danger mt-1">{{ errors.gender }}</div>
        </div>

        <!-- Registration Type Field -->
        <div class="mb-3">
          <select v-model="userType" class="form-select">
            <option value="" disabled selected>Select Registration Type*</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div v-if="errors.userType" class="text-danger mt-1">{{ errors.userType }}</div>
        </div>

        <!-- Password Field -->
        <div class="mb-3">
          <input 
            v-model="password" 
            @input="validatePassword" 
            type="password" 
            class="form-control" 
            placeholder="Password*" 
          >
          <div v-if="errors.password" class="text-danger mt-1">{{ errors.password }}</div>
        </div>

        <!-- Confirm Password Field -->
        <div class="mb-3">
          <input 
            v-model="confirmPassword" 
            @input="validateConfirmPassword" 
            type="password" 
            class="form-control" 
            placeholder="Confirm Password*" 
          >
          <div v-if="errors.confirmPassword" class="text-danger mt-1">{{ errors.confirmPassword }}</div>
        </div>

        <!-- Phone Number Field -->
        <div class="mb-3">
          <input 
            v-model="phoneNumber" 
            @input="validatePhoneNumber" 
            type="tel" 
            class="form-control" 
            placeholder="Phone Number*" 
          >
          <div v-if="errors.phoneNumber" class="text-danger mt-1">{{ errors.phoneNumber }}</div>
        </div>

        <!-- Reason Field -->
        <div class="mb-3">
          <textarea 
            v-model="reason" 
            class="form-control" 
            placeholder="Reason for joining*" 
          ></textarea>
          <div v-if="errors.reason" class="text-danger mt-1">{{ errors.reason }}</div>
        </div>

        <div class="d-flex justify-content-between">
          <button type="submit" class="btn btn-primary w-48">Register</button>
          <button type="button" @click="clearForm" class="btn btn-danger w-48">Clear</button>
        </div>
      </form>
      <p class="text-center mt-3">
        Already have an account? <router-link to="/login" class="text-primary">Log in here!</router-link>
      </p>
    </div>

    <!-- Footer Section -->
    <FooterComponent />
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import FooterComponent from '../components/FooterComponent.vue'

export default {
  name: 'RegisterPage',
  components: {
    FooterComponent
  },
  setup() {
    const router = useRouter()
    const username = ref('')
    const gender = ref('')
    const userType = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const phoneNumber = ref('')
    const reason = ref('')

    const errors = reactive({
      username: '',
      gender: '',
      userType: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      reason: ''
    })

    const validateUsername = () => {
      if (username.value.length === 0) {
        errors.username = 'Username is required'
      } else if (username.value.length < 3) {
        errors.username = 'Username must be at least 3 characters long'
      } else {
        errors.username = ''
      }
    }

    const validatePassword = () => {
      if (password.value.length === 0) {
        errors.password = 'Password is required'
      } else if (password.value.length < 6) {
        errors.password = 'Password must be at least 6 characters long'
      } else {
        errors.password = ''
      }
    }

    const validateConfirmPassword = () => {
      if (confirmPassword.value.length === 0) {
        errors.confirmPassword = 'Please confirm your password'
      } else if (password.value !== confirmPassword.value) {
        errors.confirmPassword = 'Passwords do not match'
      } else {
        errors.confirmPassword = ''
      }
    }

    const validatePhoneNumber = () => {
      const phoneRegex = /^\d{10}$/
      if (phoneNumber.value.length === 0) {
        errors.phoneNumber = 'Phone number is required'
      } else if (!phoneRegex.test(phoneNumber.value)) {
        errors.phoneNumber = 'Please enter a valid 10-digit phone number'
      } else {
        errors.phoneNumber = ''
      }
    }

    const validateForm = () => {
      validateUsername()
      validatePassword()
      validateConfirmPassword()
      validatePhoneNumber()

      if (gender.value === '') {
        errors.gender = 'Please select a gender'
      } else {
        errors.gender = ''
      }

      if (userType.value === '') {
        errors.userType = 'Please select a registration type'
      } else {
        errors.userType = ''
      }

      if (reason.value === '') {
        errors.reason = 'Please provide a reason for joining'
      } else {
        errors.reason = ''
      }
    }

    const handleSubmit = () => {
      validateForm()

      if (Object.values(errors).every(error => error === '')) {
        const newUser = {
          userId: username.value,
          gender: gender.value,
          userType: userType.value,
          password: password.value,
          phoneNumber: phoneNumber.value,
          reason: reason.value
        }

        // Get all users from localStorage and store them sorted by user type
        const allUsers = JSON.parse(localStorage.getItem('users') || '{}')
        const users = allUsers[userType.value] || []

        users.push(newUser)
        allUsers[userType.value] = users
        localStorage.setItem('users', JSON.stringify(allUsers))

        router.push('/login')
      }
    }

    const clearForm = () => {
      username.value = ''
      gender.value = ''
      userType.value = ''
      password.value = ''
      confirmPassword.value = ''
      phoneNumber.value = ''
      reason.value = ''

      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })
    }

    return {
      username,
      gender,
      userType,
      password,
      confirmPassword,
      phoneNumber,
      reason,
      errors,
      handleSubmit,
      clearForm,
      validateUsername,
      validatePassword,
      validateConfirmPassword,
      validatePhoneNumber
    }
  }
}
</script>

<style scoped>
.register-container {
  max-width: 600px;
  width: 100%;
}

.btn {
  font-weight: bold;
}

.w-48 {
  width: 48%;
}

.text-primary {
  color: #0d6efd;
}

.text-danger {
  color: #dc3545;
}
</style>