import type {RouteRecordRaw} from 'vue-router';

const interview: RouteRecordRaw = [{
    path: '/interview',
    name: 'interview',
    redirect: '/project/index',
    meta: {
        title: "面试",
    },
    children: [
        {
            name: 'devops',
            path: '/project/devops',
            component: () => import('@/views/interview/devops.vue'),
            meta: {
                title: "devops",
            },
        },
        {
            name: 'css',
            path: '/css/index',
            meta: {
                title: "css",
            },
            component: () => import('@/views/interview/css.vue'),
        },
        {
            name: 'html',
            path: '/html/index',
            meta: {
                title: "html",
            },
            component: () => import('@/views/interview/html.vue'),
        },
        {
            name: ' 页面优化',
            path: '/pageOptimization/index',
            meta: {
                title: "页面优化",
            },
            component: () => import('@/views/interview/pageOptimization.vue'),
        },
        {
            name: 'dgp',
            path: '/dgp/index',
            meta: {
                title: "dgp",
            },
            component: () => import('@/views/interview/dgp.vue'),
        },
        {
            name: 'mcp',
            path: '/mcp/index',
            meta: {
                title: "mcp",
            },
            component: () => import('@/views/interview/mcp.vue'),
        },
        {
            name: 'vue',
            path: '/vue/index',
            meta: {
                title: "vue",
            },
            component: () => import('@/views/interview/myVue.vue'),
        },
        {
            name: 'js',
            path: '/mcp/index',
            meta: {
                title: "js",
            },
            component: () => import('@/views/interview/js.vue'),
        },
    ],
}];

export default interview;