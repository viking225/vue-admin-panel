<template>
  <div id="app">
    <auth
      :apiurl="apiurl"
      @token-updated="onTokenUpdate($event)"
      v-show="!isAuthenticated()"
    />
    <div v-show="isAuthenticated()" class="authenticated">
      <div class="mainContent">
        <element-admin-page
          :endpoint-info="getData()"
          :token="token"
          :apiurl="apiurl"
        />
      </div>
      <sidebar :endpoints="endpointsInfos" class="sidebar" />
    </div>
    <!-- login component  -->
    <!-- side bar component -->
    <!-- main component -->
    <!-- footer component -->
  </div>
</template>

<script lang="ts">
import { IinfoType, IObject, IEndpointElement } from "./types";
import Auth from "./components/Authentication.vue";
import Sidebar from "./components/Sidebar.vue";
import ElementAdminPage from "./components/ElementAdminPage.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    Auth,
    Sidebar,
    ElementAdminPage
  }
})
export default class App extends Vue {
  // Data
  private token: string | null = null;
  private apiurl: string = "http://localhost:3300";
  private endpointsInfos: IEndpointElement[] | null = null;

  // LifeCycle
  created() {
    this.endpointsInfos = [
      {
        name: "Peoples",
        print: {
          exclude: [
            "_id",
            "__v",
            "lastFirstName",
            "firstLastName",
            "picturePro"
          ],
          alias: [
            {
              value: "lastName",
              alias: "Nom",
              order: 0
            },
            {
              value: "firstName",
              alias: "Prénom",
              order: 1
            }
          ]
        }
      },
      {
        name: "Tools"
      },
      {
        name: "Users"
      }
    ];
  }

  // Methods
  isAuthenticated() {
    return this.token !== null;
  }

  getData() {
    return this.endpointsInfos ? this.endpointsInfos[0] : null;
  }

  onTokenUpdate(token: string) {
    this.token = token;
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

.authenticated {
  background-color: tomato;
  display: flex;
  flex: 1;
  flex-direction: row;
  width: 100%;
}

.sidebar {
  order: -1;
  flex: 1;
}

.mainContent {
  background-color: yellow;
  order: 1;
  flex: 10;
}
</style>
