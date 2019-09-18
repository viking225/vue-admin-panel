<template>
  <div id="dashboard">
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
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IinfoType, IObject, IEndpointElement } from "../types";
import { StorageHelper, StringHelper } from "../helpers";
import { endpoints } from "../config";

@Component({})
export default class Dashboard extends Vue {
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
}
</script>

<style scopped>
#dashboard {
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
  padding: 0 5%;
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
