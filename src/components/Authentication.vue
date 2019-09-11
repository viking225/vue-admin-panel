<template>
  <div id="authenticationComponent">
    <div class="loginContainer" v-bind:class="classes">
      <h1>Login form</h1>
      <input
        type="text"
        name="username"
        placeholder="Username"
        v-model="username"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        v-model="passwd"
      />
      <button @click="login" class="connectButton">Connect</button>
      <div class="loader">
        <atom-spinner :animation-duration="1500" :size="64" color="#e50cba" />
      </div>
      <div class="errorContent">
        <p>{{ errorMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { IObject, RequestTypes } from "../types";
import { Component, Prop, Emit, Vue } from "vue-property-decorator";
import { AtomSpinner } from "epic-spinners";
import { apiHelper, StorageHelper } from "../helpers";

@Component({
  components: {
    AtomSpinner
  }
})
export default class Authentication extends Vue {
  // Data
  private username: string = "";
  private passwd: string = "";
  private classes: IObject = {
    error: false,
    loading: false
  };

  private errorMsg = "";

  // Computed
  get connectUrl() {
    return `authentication`;
  }

  // Life cycle
  mounted() {
    this.classes.error = false;
  }

  // Methods
  tokenUpdated(json: any) {
    StorageHelper.setToken(json.accessToken);
    StorageHelper.setTokenExpireDate(json.expiresIn);

    let redirect = this.$route.query.redirect || "/";
    this.$router.replace(redirect as string);
  }

  async login() {
    // Change classes
    this.classes = {
      loading: true,
      error: false
    };

    // launch fetch to apiUrl
    const data: RequestTypes.IAuthRequest = {
      userName: this.username,
      password: this.passwd
    };

    const fetchParams = {
      method: "POST",
      body: JSON.stringify(data)
    };

    let response: any = null;
    try {
      response = await apiHelper.request(this.connectUrl, fetchParams);
    } catch (e) {
      console.log(e);
      this.classes = {
        error: true,
        loading: false
      };
      this.errorMsg = "An unknown error happened";
      return;
    }
    this.classes.loading = false;
    if (response.status !== 201) {
      this.classes.error = true;
      this.errorMsg = `${response.message}`;
      return;
    }

    // emit change token
    this.tokenUpdated(response.json);
  }
}
</script>

<style scoped>
#authenticationComponent {
  display: flex;
  justify-content: center;
}
.loginContainer {
  display: flex;
  flex-direction: column;
  align-content: center;
  min-width: 50%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.loginContainer > * {
  padding: 10px;
  margin: 10px 5px 10px 5px;
}

.loginContainer.error {
  box-shadow: 0 4px 8px 0 #e50c0c, 0 6px 20px 0 #e50c0c;
}

.connectButton {
  display: block;
  background-color: aqua;
}

.loader,
.errorContent {
  display: none;
}

.loading .loader {
  display: flex;
  justify-content: center;
}

.loading .connectButton {
  display: none;
}

.error .errorContent {
  display: inline-block;
  color: red;
}
</style>
