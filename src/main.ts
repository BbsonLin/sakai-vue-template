import { createApp } from 'vue';
import 'virtual:uno.css'
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import '@/assets/styles.scss';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, { ripple: true });
app.use(ToastService)

app.mount('#app');
