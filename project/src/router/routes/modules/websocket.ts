import type {RouteRecordRaw} from 'vue-router';

const websocket: RouteRecordRaw = [{
  path: '/ws',
  name: 'ws',
  redirect: '/ws/index',
  meta: {
    title: "websocket",
  },
  children: [
    {
      name: 'baiduMap',
      path: '/map/index',
      component: () => import('@/views/ws/index.vue'),
      meta: {
        title: "websocket",
      },
    }
  ],
}];

export default websocket;