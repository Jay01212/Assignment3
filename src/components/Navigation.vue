<template>
  <nav class="navigation navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand logo" href="/">MyMentalHealth.com</a>
      <button class="navbar-toggler" type="button" @click="toggleNavbar" aria-controls="navbarNav"
        :aria-expanded="isNavbarOpen" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" :class="{ 'show': isNavbarOpen }" id="navbarNav">
        <ul class="navbar-nav nav-center me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active" @click="closeNavbar">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link" active-class="active" @click="closeNavbar">About</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/resources" class="nav-link" active-class="active"
              @click="closeNavbar">Resources</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/community" class="nav-link" active-class="active"
              @click="closeNavbar">Community</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/emergency" class="nav-link" active-class="active" @click="closeNavbar">Emergency
              Help</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/Events" class="nav-link" active-class="active" @click="closeNavbar">Events</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/Map" class="nav-link" active-class="active" @click="closeNavbar">Map</router-link>
          </li>
        </ul>
        <ul class="navbar-nav nav-right">
          <li v-if="!currentUser" class="nav-item">
            <router-link to="/Firelogin" class="nav-link" active-class="active" @click="closeNavbar">Login</router-link>
          </li>
          <li v-else class="nav-item">
            <a @click="handleLogout" class="nav-link" href="#">Logout</a>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link to="/admin" class="nav-link" active-class="active" @click="closeNavbar">Admin</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

export default {
  name: 'Navigation',
  setup() {
    const router = useRouter()
    const auth = getAuth()
    const currentUser = ref(null)
    const isNavbarOpen = ref(false)

    const isAdmin = computed(() => currentUser.value?.email === 'admin@gmail.com')

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        currentUser.value = user
      })
    })

    const toggleNavbar = () => {
      isNavbarOpen.value = !isNavbarOpen.value
    }

    const closeNavbar = () => {
      isNavbarOpen.value = false
    }

    const handleLogout = () => {
      if (confirm('Are you sure you want to log out?')) {
        signOut(auth).then(() => {
          router.push('/')
          closeNavbar()
        }).catch((error) => {
          console.error('Logout error:', error)
        })
      }
    }

    return {
      currentUser,
      isAdmin,
      handleLogout,
      isNavbarOpen,
      toggleNavbar,
      closeNavbar
    }
  }
}
</script>


<style scoped>
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-weight: bold;
  font-size: 1.5em;
  color: rgb(94, 147, 219);
  text-decoration: none;
}

.nav-center {
  justify-content: center;
  flex-grow: 1;
}

.nav-right {
  justify-content: flex-end;
}

.nav-link {
  color: rgb(94, 147, 219);
  text-decoration: none;
  font-weight: bold;
}

.nav-link:hover,
.nav-link:focus,
.nav-link.active {
  color: rgb(66, 103, 178);
}

@media (max-width: 991px) {
  .navbar-nav {
    flex-direction: column;
  }
}
</style>