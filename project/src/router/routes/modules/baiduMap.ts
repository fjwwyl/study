import type {RouteRecordRaw} from 'vue-router';

const baiduMap: RouteRecordRaw = [{
    path: '/map',
    name: 'map',
    redirect: '/map/index',
    meta: {
        title: "地图",
    },
    children: [
        {
            name: 'baiduMap',
            path: '/map/index',
            component: () => import('@/views/map/index.vue'),
            meta: {
                title: "map",
            },
        }
    ],
}];

export default baiduMap;