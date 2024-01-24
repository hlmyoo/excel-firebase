import { createRouter, createWebHistory } from 'vue-router'
import excelPreview from '../views/excelPreview.vue'
import excelDetail from '../views/excelDetail.vue'
import home from '../views/home.vue'

const routes = [
  {
    path: '/',
    component: home
  },
  {
    path: '/excel',
    component: excelPreview
  },
  {
    path: '/excel/:id',
    component: excelDetail
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
