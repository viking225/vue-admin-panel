<template>
  <div class="line-edit-element" :class="classes">
    <div
      class="table-cell"
      v-for="(header, index) in attributes"
      :key="index"
      v-show="show"
    >
      {{ data[header.value] }}
    </div>
    <div class="table-cell action" v-show="show">
      <button>
        <router-link :to="`/${endpointPath}/${this.data._id}`">
          Edit
        </router-link>
      </button>
      <button @click="onDelete">Delete</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { IObject, IEndpointElement } from "../types";
import { apiHelper, StringHelper } from "../helpers";

@Component({})
export default class LineEditElment extends Vue {
  // Props
  @Prop() private endpointInfo!: IEndpointElement;
  @Prop() private token!: string;
  @Prop() private apiurl!: string;
  @Prop() private data!: IObject;
  @Prop() private attributes!: { alias: string; value: string }[];
  // @Prop() private disabledActions: string[] = [];

  // Data
  private show: boolean = true;
  private errorMsg: string = "";
  private classes: IObject = {
    error: false,
    loading: false
  };
  // Lifecycle
  // Event
  @Emit()
  itemRemoved(id: string) {
    return id;
  }
  // Computed
  get endpoint() {
    return `${this.endpointPath}/${this.data._id}`;
  }

  get endpointPath() {
    return StringHelper.normalize(this.endpointInfo.name);
  }
  // Methods
  async onDelete() {
    if (this.classes.loading) {
      return;
    }
    this.classes = {
      error: false,
      loading: true
    };

    const fetchParams = {
      method: "DELETE"
    };

    let response: any = null;
    try {
      response = await apiHelper.request(this.endpoint, fetchParams);
    } catch (e) {
      this.classes = {
        error: true,
        loading: false
      };
      this.errorMsg = "Unknown error";
      return;
    }
    this.classes.loading = false;
    if (response.status !== 200) {
      this.classes.error = true;
      this.errorMsg = `${response.json.message}`;
    }

    if (response.json._id === this.data._id) {
      // Emit remove element to elementAdminPage
      this.itemRemoved(response.json._id);
    }
  }
}
</script>
<style scoped>
.line-edit-element.loading .table-cell {
  background-color: slateblue;
  border: solid slateblue;
}
</style>
