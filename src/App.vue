<template>
  <div id="app">
    <Auth
      :apiurl="apiurl"
      @token-updated="onTokenUpdate($event)"
      v-show="!isAuthenticated()"
    />
    <div v-show="isAuthenticated()" class="authenticated">
      <h1>77 C LA CHAMPIONS LEAGUE</h1>
    </div>
    <!-- login component  -->
    <!-- side bar component -->
    <!-- main component -->
    <!-- footer component -->
  </div>
</template>

<script lang="ts">
import { IinfoType } from "./types";
import Auth from "./components/Authentication.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    Auth
  }
})
export default class App extends Vue {
  token: string | null = null;
  apiurl: string = "http://localhost:3300";

  isAuthenticated() {
    return this.token !== null;
  }

  onTokenUpdate(token: string) {
    this.token = token;
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
