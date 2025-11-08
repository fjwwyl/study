import type {RouteRecordRaw} from 'vue-router';

const devops: RouteRecordRaw = [{
  path: '/project-devops',
  name: 'project-devops',
  redirect: '/project-devops/index',
  meta: {
    title: "开发一体化平台项目",
  },
  children: [
    {
      name: 'design-pattern',
      path: '/design-pattern/index',
      component: () => import('@/views/devops/design-pattern.vue'),
      meta: {
        title: "设计模式项目",
      },
    },
    {
      name: 'dictionary',
      path: '/dictionary/index',
      component: () => import('@/views/devops/dictionary.vue'),
      meta: {
        title: "字典组件",
      },
    },
    {
      name: 'upload',
      path: '/upload/index',
      component: () => import('@/views/devops/upload.vue'),
      meta: {
        title: "大文件上传",
      },
    },
  ]

}];

export default devops;