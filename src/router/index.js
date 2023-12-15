import { createRouter, createWebHistory } from 'vue-router';
import FormSalesOrder from '../components/FormSalesOrder.vue';
import Dashboard from '../components/Dashboard.vue';

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
  }
  // Adicione outras rotas conforme necessário
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;