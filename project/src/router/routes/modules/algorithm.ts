const path = "/src/views/algorithm/";
const modules = import.meta.glob("/src/views/algorithm/*.vue")

const algorithms = Object.keys(modules).map(m => m.replace(path, "").replace(".vue", ""))


import type {RouteRecordRaw} from 'vue-router';


const algorithmsRouter: RouteRecordRaw = [{
  path: '/algorithm',
  name: 'algorithm',
  redirect: algorithms[0] ? algorithms[0] + "index" : "",
  meta: {
    title: "算法",
  },
  children: algorithms.map(algorithm => ({
    name: algorithm,
    path: algorithm,
    component: () => import(`@/views/algorithm/${algorithm}.vue`),
    meta: {
      title: algorithm,
    },
  }))

}];

export default algorithmsRouter;