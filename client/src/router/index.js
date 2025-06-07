import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import AdminMovimientos from '@/components/admin/Movimientos.vue'
import AdminRepuestos from '@/components/admin/Repuestos.vue'
import AdminUsuarios from '@/components/admin/Usuarios.vue'
import AdminVentas from '@/components/admin/Ventas.vue'


const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'movimientos', component: AdminMovimientos },
      { path: 'repuestos', component: AdminRepuestos },
      { path: 'usuarios', component: AdminUsuarios },
      { path: 'ventas', component: AdminVentas }
    ]
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/components/cliente/Home.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router