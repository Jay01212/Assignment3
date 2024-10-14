import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'
import Home from '../views/HomeView.vue'
import LibraryView from '../views/LibraryView.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import ResourceView from '@/views/ResourceView.vue'
import EventsView from '@/views/EventsView.vue'
import MapView from '@/views/MapView.vue'
import AddResourceView from '@/views/AddResourceView.vue'
import AddEventView from '@/views/AddEventView.vue'
import SendEmailView from '@/views/SendEmailView.vue'
import AdminEventManagement from '@/views/AdminEventManagement.vue'
import AdminResourceManagement from '@/views/AdminResourceManagement.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/Firelogin', name: 'FireLogin', component: FirebaseSigninView },
  { path: '/FireRegister', name: 'FireRegister', component: FirebaseRegisterView },
  { path: '/admin', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/send-email', name: 'SendEmail', component: SendEmailView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/resource-management', name: 'ResourceManagement', component: AdminResourceManagement, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/add-resource', name: 'AddResource', component: AddResourceView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/event-management', name: 'EventManagement', component: AdminEventManagement, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/add-event', name: 'AddEvent', component: AddEventView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/Resource', name: 'Resource', component: ResourceView, meta: { requiresAuth: true } },
  { path: '/Events', name: 'Events', component: EventsView, meta: { requiresAuth: true } },
  { path: '/Map', name: 'Map', component: MapView, meta: { requiresAuth: true } },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
    meta: { requiresAuth: true }
  },
  { path: '/library', name: 'Library', component: LibraryView, meta: { requiresAuth: true } },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: ArticleDetail,
    props: true,
    meta: { requiresAuth: true }
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
  const isLoggedIn = !!auth.currentUser
  const isAdmin = auth.currentUser?.email === 'admin@gmail.com'

  if (requiresAuth && !isLoggedIn) {
    alert('You need to be logged in to access this page.')
    next({ path: '/Firelogin', query: { redirect: to.fullPath } })
  } else if (requiresAdmin && !isAdmin) {
    alert('You do not have permission to access this page.')
    next('/')
  } else {
    next()
  }
})

export default router