<template>
  <div id="sidebarComponent">
    <h1 class="title">Menu</h1>
    <div
      v-for="(endpoint, index) in endpoints"
      :key="`endpoint-${index}`"
      class="endpointDiv"
    >
      {{ endpoint.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { IEndpointElement } from "../types";

@Component
export default class Sidebar extends Vue {
  // Props
  @Prop() private endpoints!: IEndpointElement;
  // data
  // life cycle
  mounted() {}
  // Methods
}
</script>
<style scoped>
#sidebarComponent {
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
