import Vuex, { Store } from "vuex";
import Vue from "vue";
import { endpoints } from "../config";
import { IStore, IEndpointElement, IObject } from "@/types";
import { StringHelper } from "@/helpers";
import authStore from "./auth";
import itemStore from "./item";

Vue.use(Vuex);

const store: Store<IStore> = new Vuex.Store({
  modules: {
    auth: authStore,
    item: itemStore
  },
  state: {
    endpoints
  },
  getters: {
    getEndpointInfoByName: state => (name): IEndpointElement | null => {
      name = StringHelper.normalize(name);
      const endpoint = state.endpoints.find(
        endpoint => StringHelper.normalize(endpoint.name) === name
      );
      return endpoint ? endpoint : null;
    }
  },
  mutations: {},
  actions: {}
});

export default store;
