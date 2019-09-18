import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import App from "./App.vue";
import router from "./routes";

Vue.config.productionTip = false;
new Vue({
  render: h => h(App),
  router
}).$mount("#app");
