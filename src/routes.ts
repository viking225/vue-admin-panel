import VueRouter, { RouteConfig } from "vue-router";
import { endpoints } from "./config";
import { IEndpointElement } from "./types";
import { StorageHelper, StringHelper } from "./helpers";

import ElementAdminPage from "./components/ListAdminPage.vue";
import Authentication from "./components/Authentication.vue";
import EditAdminPage from "./components/EditAdminPage.vue";

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
endpoints.forEach((endpointInfo: IEndpointElement) => {
  const route = StringHelper.normalize(endpointInfo.name);

  // Main route
  routes.push({
    name: route,
    path: `/${route}`,
    component: ElementAdminPage,
    props: {
      endpointInfo
    },
    beforeEnter: requireAuth
  });

  routes.push({
    path: `/${route}/:id`,
    component: EditAdminPage,
    props: {
      editInfos: endpointInfo
    }
  });
});

// login
routes.push({
  path: "/login",
  component: Authentication
});

export default new VueRouter({ routes });
