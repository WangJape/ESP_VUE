import {createRouter, createWebHashHistory, createWebHistory} from "vue-router"
import Index from "@/pages/Index.vue";

const routes = [
  {
    path: "/",
    redirect: "/index"
  },
  {
    path: "/index",
    component: Index
  },
  {
    path: "/login",
    component: () => import("@/pages/Login.vue")
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/index"
  }
];

// 创建路由实例
const router = createRouter({
  // 采用hash 模式
  history: createWebHashHistory(),
  // 采用 history 模式
  // history: createWebHistory(),
  routes, //使用上方定义的路由配置
})

//全局前置守卫
router.beforeEach((to, from) => {
  console.log("全局前置导航守卫[" + from.path + "]->[" + to.path + "]");
});
export default router;
