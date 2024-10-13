<template>
  <nav class="navigation navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand logo" href="/">MyMentalHealth.com</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav nav-center me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active">Home</router-link>
          </li>
          <li class="nav-item">
            <a @click="handleNavClick('/about')" class="nav-link"
              :class="{ active: $route.path === '/about' }">About</a>
          </li>
          <li class="nav-item">
            <a @click="handleNavClick('/resources')" class="nav-link"
              :class="{ active: $route.path === '/resources' }">Resources</a>
          </li>
          <li class="nav-item">
            <a @click="handleNavClick('/community')" class="nav-link"
              :class="{ active: $route.path === '/community' }">Community</a>
          </li>
          <li class="nav-item">
            <a @click="handleNavClick('/emergency')" class="nav-link"
              :class="{ active: $route.path === '/emergency' }">Emergency Help</a>
          </li>
          <li class="nav-item">
            <router-link to="/Events" class="nav-link" active-class="active">Events</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/Map" class="nav-link" active-class="active">Map</router-link>
          </li>
        </ul>
        <ul class="navbar-nav nav-right">
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link to="/Firelogin" class="nav-link" active-class="active">Login</router-link>
          </li>
          <li v-else class="nav-item">
            <a @click="handleLogout" class="nav-link" href="#">Logout</a>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link to="/FireRegister" class="nav-link" active-class="active">Firebase Register</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthentication } from '../router/authentication'
import { useRouter } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'

export default {
  name: 'Navigation',
  setup() {
    const { isAuthenticated, logout } = useAuthentication()
    const router = useRouter()
    const auth = getAuth()

    const handleNavClick = (path) => {
      if (!isAuthenticated.value && path !== '/') {
        alert('Your request has been denied because the user is not logged in')
        router.push('/Firelogin')
      } else {
        router.push(path)
      }
    }

    const handleLogout = () => {
      if (confirm('Are you sure you want to log out?')) {
        signOut(auth).then(() => {
          logout()
          router.push('/')
        }).catch((error) => {
          console.error('Logout error:', error)
        })
      }
    }

    return {
      isAuthenticated,
      handleNavClick,
      handleLogout
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