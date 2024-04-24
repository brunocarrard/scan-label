import { createRouter, createWebHistory } from 'vue-router';
import FormSalesOrder from '../components/FormSalesOrder.vue';
import Dashboard from '../components/Dashboard.vue';
import Login from '../components/Login.vue'
import { authStore } from "../stores/auth.js";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: FormSalesOrder,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
  // Adicione outras rotas conforme necessário
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('token') == '' && to.name !== 'Login' || !localStorage.getItem('token') && to.name !== 'Login') next('/login')
  else next()
})

export default router;