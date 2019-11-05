<template>
  <div class="line-edit-element">
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
        <router-link :to="`/${this.apiurl}`">
          Edit
        </router-link>
      </button>
      <button @click="onDelete">Delete</button>
    </div>
  </div>
</template>

<script lang="ts">
import { namespace } from "vuex-class";
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { IObject, IEndpointElement } from "../types";
import { apiHelper, StringHelper } from "../helpers";

const itemStore = namespace("item");

@Component({})
export default class LineEditElment extends Vue {
  // Getter
  @itemStore.Action("deleteItem") deleteItem;
  // Props
  @Prop() private apiurl!: string;
  @Prop() private data!: IObject;
  @Prop() private attributes!: { alias: string; value: string }[];
  // @Prop() private disabledActions: string[] = [];

  // Data
  private show: boolean = true;
  private errorMsg: string = "";
  // Lifecycle
  // Event
  @Emit()
  itemRemoved(id: string) {
    return id;
  }
  // Computed

  // Methods
  async onDelete() {
    console.log(this.data._id);
    await this.deleteItem({ endpoint: this.apiurl, id: this.data._id });
    this.itemRemoved(this.data._id);
  }
}
</script>
<style scoped>
.line-edit-element.loading .table-cell {
  background-color: slateblue;
  border: solid slateblue;
}
</style>
