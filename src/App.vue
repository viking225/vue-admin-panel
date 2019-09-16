<template>
  <div id="app">
    <div class="content">
      <div class="mainContent">
        <router-view :key="$route.path"></router-view>
      </div>
      <div id="sidebarComponent">
        <h1 class="title">Menu</h1>
        <div
          v-for="(endpoint, index) in menuInfo"
          :key="`endpoint-${index}`"
          class="endpointDiv"
        >
          <router-link :to="`/${endpoint.path}`">
            {{ endpoint.name }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { IinfoType, IObject, IEndpointElement } from "./types";
import { endpoints } from "./config";
import { Component, Prop, Vue } from "vue-property-decorator";
import { StorageHelper, StringHelper } from "./helpers";

@Component({})
export default class App extends Vue {
  // Data
  // LifeCycle
  created() {}

  // Computed
  get menuInfo() {
    const menuInfo: { path: string; name: string }[] = [];

    endpoints.forEach((endpointInfo: IEndpointElement) => {
      menuInfo.push({
        path: StringHelper.normalize(endpointInfo.name),
        name: StringHelper.ucFirst(endpointInfo.name)
      });
    });

    return menuInfo;
  }
  // Methods
  isAuthenticated() {
    return !!StorageHelper.getToken();
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  padding: 0;
  margin: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  min-height: 100vh;
  display: flex;
  flex-flow: column;
}

.content {
  background-color: tomato;
  display: flex;
  flex: 1;
  flex-direction: row;
  width: 100%;
}

.mainContent {
  background-color: yellow;
  order: 1;
  flex: 8;
}

#sidebarComponent {
  order: -1;
  flex: 1;
  background-color: green;
  color: white;
}

.endpointDiv {
  padding: 10px 5px 10px 5px;
}

.title {
  margin-bottom: 5px;
  border: solid white;
  border-width: 0px 0px 5px 0px;
}
</style>
