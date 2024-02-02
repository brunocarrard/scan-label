import { createApp } from 'vue'
import { createPinia } from "pinia";
import { createToastifyPlugin } from 'vue-toastify-3';
import 'vue-toastify-3/style.css';
import router from './router';
import App from './App.vue'

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(createToastifyPlugin, {
    autoClose: 5000,
    closeOnClick: true,
})
app.mount("#app");
