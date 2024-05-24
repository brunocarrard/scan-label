import { createRouter, createWebHistory } from 'vue-router';
import FormSalesOrder from '../components/Packing/FormSalesOrder.vue';
import PackingDashboard from '../components/Packing/PackingDashboard.vue';
import Dashboard from '../components/Dashboard.vue';
import StockOptions from '../components/Stock/StockOptions.vue';
import SelectStockLine from '../components/Stock/SelectStockLine.vue';
import StockDashboard from '../components/Stock/StockDashboard.vue'
import Login from '../components/Login.vue'

const routes = [
  // {
  //   path: '/',
  //   name: 'Dashboard',
  //   component: Dashboard
  // },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'FormSalesOrder',
    component: FormSalesOrder,
  },
  {
    path: '/packing/dashboard',
    name: 'PackingDashboard',
    component: PackingDashboard
  },
  {
    path: '/stock',
    name: 'StockOptions',
    component: StockOptions,
  },
  {
    path: '/stock/transfer',
    name: 'Transfer Stock',
    component: SelectStockLine
  },
  {
    path: '/stock/dashboard',
    name: 'StockDashboard',
    component: StockDashboard
  }
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