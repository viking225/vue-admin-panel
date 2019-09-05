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
      <button @click="onEdit">Edit</button>
      <button @click="onDelete">Delete</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { IObject } from "../types";

@Component({})
export default class LineEditElment extends Vue {
  // Props
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
    return `${this.apiurl}${this.data._id}`;
  }
  // Methods
  onEdit() {
    console.log("Clicked edit");
  }

  async onDelete() {
    if (this.classes.loading) {
      return;
    }
    this.classes = {
      error: false,
      loading: true
    };

    const fetchParams = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `${this.token}`
      }
    };

    let response: any = null;
    let res: any = null;
    try {
      res = await fetch(this.endpoint, fetchParams);
      response = await res.json();
    } catch (e) {
      this.classes = {
        error: true,
        loading: false
      };
      this.errorMsg = "Unknown error";
      return;
    }
    this.classes.loading = false;
    if (res.status !== 200) {
      this.classes.error = true;
      this.errorMsg = `${response.message}`;
    }

    if (response._id === this.data._id) {
      // Emit remove element to elementAdminPage
      this.itemRemoved(response._id);
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
