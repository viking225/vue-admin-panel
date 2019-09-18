import VueRouter, { RouteConfig } from "vue-router";
import { endpoints } from "./config";
import { IEndpointElement, IObject } from "./types";
import { StorageHelper, StringHelper } from "./helpers";

import ElementAdminPage from "./pages/ListAdminPage.vue";
import Authentication from "./pages/Authentication.vue";
import EditAdminPage from "./pages/EditAdminPage.vue";
import DashboardPage from "./pages/Dashboard.vue";
import App from "./App.vue";

if (endpoints.length === 0) {
  throw new Error("App doesnt got any endpoint configured");
}

// Check auth
const requireAuth = (to, from, next) => {
  const token = StorageHelper.getToken();

  if (token) {
    // check token expiresIn
    const date = StorageHelper.getTokenExpireDate();
    // check with date now
    let passTrough = !!date;

    if (passTrough && new Date(date as string).getTime() > Date.now()) {
      return next();
    }
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
    component: ElementAdminPage,
    props: {
      endpointInfo
    }
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
      editInfos: endpointInfo
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
