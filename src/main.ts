import Vue from "vue";
import VueRouter from "vue-router";
import store from "./store";

Vue.use(VueRouter);

import App from "./App.vue";
import router from "./routes";

Vue.config.productionTip = false;
new Vue({
  render: h => h(App),
  router,
  store,
}).$mount("#app");
