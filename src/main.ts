import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import Aura from '@primevue/themes/aura'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import StyleClass from 'primevue/styleclass'

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

const app = createApp(App)

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
})
app.use(ToastService)
app.directive('styleclass', StyleClass)

app.mount('#app')
