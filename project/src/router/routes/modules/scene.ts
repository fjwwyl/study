import type {RouteRecordRaw} from 'vue-router';


const algorithmsRouter: RouteRecordRaw = [{
  path: '/scene',
  name: 'scene',
  meta: {
    title: "场景题目",
  },
  component: () => import(`@/views/scene/index.vue`),
  children: []
}];

export default algorithmsRouter;