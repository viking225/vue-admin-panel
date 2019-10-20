import { IAuthStore } from "@/types/store";
import { RequestTypes } from "@/types"
import { StorageHelper, apiHelper } from "@/helpers";

const state: IAuthStore = {
  token: {
    value: StorageHelper.getToken(),
    expiresIn: StorageHelper.getTokenExpireDate()
  },
  status: RequestTypes.ERequestState.Base,
  errorMessage: ""
}
const actions = {
  async auth_request({commit}, user) {
    const fetchParams = {
      method: "POST",
      body: JSON.stringify(user)
    }

    let response: any = null;
    try {
      response = await apiHelper.request("authentication", fetchParams);
    } catch (e) {
      console.log(e);
      commit("auth_error", "An unknown error happened");
      return;
    }

    if (response.status !== 201) {
      commit("auth_error", response.json.message);
      return;
    }
    commit("auth_success");
  }
};
const mutations = {
  auth_request: (state) =>  {
    state.status = RequestTypes.ERequestState.Loading;
  },
  auth_success: (state) =>  {
    state.status = RequestTypes.ERequestState.Success;
  },
  auth_error: (state, msg) =>  {
    state.status = RequestTypes.ERequestState.Error;
    state.errorMessage = msg;
  }
};
const getters = {
  isAuthenticated: ({token}: IAuthStore): Boolean =>  {
    if (!token || !token.value || !token.expiresIn) {
      return false;
    }
    if (new Date(token.expiresIn).getTime() < Date.now()) {
      return false;
    }
    return true;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
}