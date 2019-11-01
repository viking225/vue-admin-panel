import VueRouter, { RouteConfig } from "vue-router";
import { IEndpointElement } from "@/types";
import { StringHelper } from "@/helpers";

import ListAdminPage from "@/pages/ListAdminPage.vue";
import Authentication from "@/pages/Authentication.vue";
import EditAdminPage from "@/pages/EditAdminPage.vue";
import DashboardPage from "@/pages/Dashboard.vue";
import store from "@/store";

const { endpoints } = store.state;
if (store.state.endpoints.length === 0) {
  throw new Error("App doesnt got any endpoint configured");
}

// Check auth
const requireAuth = (to, from, next) => {
  const isAuthenticated = store.getters["auth/isAuthenticated"];
  if (isAuthenticated) {
    return next();
  }
  next({
    path: "/login",
    query: { redirect: to.fullPath }
  });
};

// Use config to generate routes
const routes: RouteConfig[] = [];

// login
routes.push({
  path: "/login",
  component: Authentication
});

// Construct authentified:
const children: RouteConfig[] = [];

// Dynamic routes
endpoints.forEach((endpointInfo: IEndpointElement) => {
  const route = StringHelper.normalize(endpointInfo.name);

  const findRoute = {
    name: route,
    path: `/${route}`,
    component: ListAdminPage
  };

  // Default route
  // Use first elemeent in config as default
  if (children.length === 0) {
    children.push({
      ...findRoute,
      path: ""
    });
  }
  // Main route
  children.push(findRoute);

  children.push({
    path: `/${route}/:id`,
    component: EditAdminPage,
    props: {
      modelName: route
    }
  });
});

// Authentified routes
routes.push({
  path: "",
  component: DashboardPage,
  beforeEnter: requireAuth,
  children
});

export default new VueRouter({ routes });
