<template>
  <div id="authenticationComponent">
    <div class="loginContainer" v-bind:class="classes">
      <h1>Login form</h1>
      <input
        type="text"
        name="username"
        placeholder="Username"
        v-model="username"
        @keyup.enter="onEnter"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        v-model="passwd"
        @keyup.enter="onEnter"
      />
      <button @click="launchLogin" class="connectButton">Connect</button>
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
import { Action, namespace } from "vuex-class";
import { IObject, RequestTypes } from "../types";
import { Component, Prop, Watch, Emit, Vue } from "vue-property-decorator";
import { AtomSpinner } from "epic-spinners";
import { apiHelper, StorageHelper } from "../helpers";

// Types
const statusValues = RequestTypes.ERequestState;
// Modules
const authModule = namespace("auth");

@Component({
  components: {
    AtomSpinner
  }
})
export default class Authentication extends Vue {
  // Store
  // Action
  @authModule.Action("auth_request") login;
  // State
  @authModule.State("status") status;
  @authModule.State("errorMessage") errorMsg;
  // Getters
  @authModule.Getter("isAuthenticated") isAuthenticated;

  // Data
  private username: string = "";
  private passwd: string = "";
  private classes: IObject = {
    error: false,
    loading: false
  };

  // Watcher
  @Watch("status")
  onStatusChanged(
    val: RequestTypes.ERequestState,
    oldVal: RequestTypes.ERequestState
  ) {
    this.classes.loading = val === statusValues.Loading;
    this.classes.error = val === statusValues.Error;

    if (val === statusValues.Success) {
      this.tokenUpdated();
    }
  }

  // events
  onEnter({ target }) {
    let inputs = document.querySelectorAll(".loginContainer input");

    let emptyField = false;
    inputs.forEach(element => {
      if (emptyField) {
        return;
      }
      const input = element as HTMLInputElement;
      if (!input.value) {
        console.log("focus");
        input.focus();
        emptyField = true;
      }
    });

    if (!emptyField) {
      this.launchLogin();
    }
  }

  // Computed

  // Life cycle
  mounted() {
    this.classes.error = false;

    console.log("mounted");
    console.log(this.isAuthenticated);
    if (this.isAuthenticated) {
      this.tokenUpdated();
    }
  }

  // Methods
  tokenUpdated() {
    const redirect = this.$route.query.redirect || "/";
    this.$router.push(redirect as string);
  }
  launchLogin() {
    const user = {
      username: this.username,
      password: this.passwd
    };
    this.login(user);
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
