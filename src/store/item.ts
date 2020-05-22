import { IObject, RequestTypes } from "@/types";
import { IPagesInfos, IitemStore } from "@/types/store";
import { apiHelper } from "@/helpers";

const actualItems: IObject[] = [];
const pageInfos: IPagesInfos = {
  actual: 1,
  max: 1,
  limit: 10,
};

const state: IitemStore = {
  actualItems,
  pageInfos,
  status: RequestTypes.ERequestState.Base,
  errorMessage: "",
};
const actions = {
  async deleteItem({ commit, state }, { endpoint, id }) {
    commit("request");

    const fetchParams = {
      method: "DELETE",
    };

    try {
      await apiHelper.request(`${endpoint}/${id}`, fetchParams);
    } catch (e) {
      commit("request_error", "Unknown error");
      return;
    }
    commit("success");
  },

  async loadItems({ commit, state }, endpoint) {
    console.log("Call load items");
    commit("request");
    const $skip =
      state.pageInfos.actual * state.pageInfos.limit - state.pageInfos.limit;
    const findParams = {
      $limit: state.pageInfos.limit,
      $skip,
    };

    let count = 0;
    const fetchUrl = Object.keys(findParams).reduce((url, paramKey) => {
      count++;
      return count === 1
        ? `${url}?${paramKey}=${findParams[paramKey]}`
        : `${url}&${paramKey}=${findParams[paramKey]}`;
    }, `${endpoint}`);

    let response: any = null;
    try {
      response = await apiHelper.request(fetchUrl, { method: "GET" });
    } catch (e) {
      commit("request_error", "Error Unknown");
      return;
    }

    if (response.status !== 200) {
      commit("request_error", response.message);
      return;
    }

    commit("load_success", response.json);
  },
};
const getters = {};
const mutations = {
  success: state => {
    state.status = RequestTypes.ERequestState.Success;
  },
  load_success: (state, response) => {
    const { data, total, limit, skip } = response;
    state.pageInfos.max = total ? Math.ceil(total / limit) : 0;
    state.pageInfos.actual = skip < limit ? 1 : Math.ceil(skip / limit) + 1;
    state.actualItems = data;
    state.status = RequestTypes.ERequestState.Success;
  },
  request: state => {
    state.status = RequestTypes.ERequestState.Loading;
  },
  request_error: (state, msg) => {
    state.status = RequestTypes.ERequestState.Error;
    state.errorMessage = msg;
  },
  loadItems: (state, items: IObject[]) => {
    state.actualItems = items;
  },
  changePage: (state, pageNumber: number) => {
    state.pageInfos.actual = pageNumber;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
