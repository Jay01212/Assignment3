import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import LibraryView from '../views/LibraryView.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import EventsView from '@/views/EventsView.vue'
import MapView from '@/views/MapView.vue'
import AddEventView from '@/views/AddEventView.vue'
import { getAuth } from 'firebase/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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
    path: '/admin',
    name: 'Admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
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
    path: '/AddEvent',
    name: 'AddEvent',
    component: AddEventView
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/library',
    name: 'Library',
    component: LibraryView,
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

router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  if (requiresAuth && !auth.currentUser) {
    next('/Firelogin')
  } else if (requiresAdmin && auth.currentUser?.email !== 'admin@gmail.com') {
    next('/')
  } else {
    next()
  }
})

export default router