import type {RouteRecordRaw} from 'vue-router';

import interviewRoute from "./modules/interview"
import devopsRoute from "./modules/devops"
import algorithm from "./modules/algorithm"
import scene from "./modules/scene"
import baiduMap from "./modules/baiduMap"
import websocket from "./modules/websocket";

const routes: RouteRecordRaw[] = [
  {
    name: 'base',
    path: '/base',
    component: () => import('@/layout/layout.vue'),
    children: [
      {
        path: "/home",
        name: "home",
        meta: {
          icon: '',
          title: "首页",
        },
        component: () => import('@/views/home/index.vue'),
      },
      {
        path: "/user",
        name: "user",
        meta: {
          icon: '',
          title: "用户管理",
        },
        component: () => import('@/views/user/index.vue'),
      },
      ...interviewRoute,
      ...devopsRoute,
      ...algorithm,
      ...scene,
      ...baiduMap,
      ...websocket
    ],
  },
]
export default routes;