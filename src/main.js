import './style.css'
import {createApp} from 'vue'
import App from './App.vue'
import Particles from 'vue3-particles'
import "@fortawesome/fontawesome-free/css/all.css";

const app = createApp(App)
app.use(Particles)
app.mount('#app')            