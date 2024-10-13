import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import LibraryView from '../views/LibraryView.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import { useAuthentication } from '../router/authentication'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import EventsView from '@/views/EventsView.vue'
import MapView from '@/views/MapView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/Firelogin',
    name: 'FireLogin',
    component: FirebaseSigninView,
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/Events',
    name: 'Events',
    component: EventsView
  },
  {
    path: '/Map',
    name: 'Map',
    component: MapView
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/library',
    name: 'Library',
    component: LibraryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: ArticleDetail,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const { isAuthenticated, isAdmin } = useAuthentication()

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated.value) {
    next({ name: 'FireLogin' })
  } else if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin.value) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router