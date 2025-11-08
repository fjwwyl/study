import {createRouter, createWebHistory} from 'vue-router'
import menuRoutes from "./routes"
import {auth} from "../utils/auth"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: "login"
    },
    {
      path: "/login",
      name: "login",
      component: () => import('../views/login/index.vue'),
    },
    ...menuRoutes
  ],
})
router.beforeEach((to, from, next) => {
  const authId = auth.currentUser.id;
  if (to.path === "/login" && authId) {
    next('/home')
  } else {
    next()
  }
})

export default router
