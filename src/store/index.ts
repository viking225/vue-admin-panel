import Vuex, { Store } from "vuex";
import Vue from "vue";
import { endpoints } from "../config";
import { IStore, IEndpointElement, IObject } from "@/types";
import { StringHelper, apiHelper } from "@/helpers";
import { IPagesInfos } from "@/types/store";
import authStore from "./auth";

Vue.use(Vuex);

const actualItems: IObject[] = [];
const pageInfos: IPagesInfos = {
  actual: 1,
  max: 1
};

const store: Store<IStore> = new Vuex.Store({
  modules: {
    auth: authStore
  },
  state: {
    endpoints,
    actualItems,
    pageInfos
  },
  getters: {
    getEndpointInfoByName: state => (name): IEndpointElement | null => {
      const endpoint = state.endpoints.find(
        endpoint => StringHelper.normalize(endpoint.name) === name
      );
      return endpoint ? endpoint : null;
    }
  },
  mutations: {
    loadItems(state, items: IObject[]) {
      state.actualItems = items;
    }
  },
  actions: {
    async loadItems({ commit }, endpoint, force = false) {}
  }
});

export default store;
