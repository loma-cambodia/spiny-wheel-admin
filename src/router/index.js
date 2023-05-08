import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { store } from "src/store/store";
import auth from "../store/auth";
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  Router.beforeEach((to, from, next) => {
    if (store.tages.filter((it) => it.name == to.name).length == 0) {
      if (to.name != "Page: Login") {
        store.tages.push({
          name: to.name,
          path: to.path,
        });
      }
    }
    // authenticate
    if (to.meta.permission) {
      if (auth.state?.user?.permissions.includes(to.meta.permission)) {
        next();
      } else {
        next({ name: "home" });
      }
    } else {
      if (to.name == "Page: Login" && auth.state.user) {
        next({ name: "home" });
      }
      next();
    }
  });
  return Router;
});
