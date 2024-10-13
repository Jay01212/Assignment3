import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpKSdbtfusLPEVubwZyPrTXDeI2oPGEy8",
  authDomain: "a3-jiayuan.firebaseapp.com",
  projectId: "a3-jiayuan",
  storageBucket: "a3-jiayuan.appspot.com",
  messagingSenderId: "48036248961",
  appId: "1:48036248961:web:13d2347787033b5e533c80"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

app.mount('#app')
