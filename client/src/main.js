import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

window.addEventListener('admin-logout', () => {
});

createApp(App).use(router).mount('#app')