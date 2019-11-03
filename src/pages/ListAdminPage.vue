<template>
  <div class="element-admin-page" :class="classes" v-show="infos">
    <div class="title">
      <h1>{{ infos ? infos.name : "" }}</h1>
    </div>
    <div class="toolbar">
      <button>
        <router-link :to="`/${this.endpoint}/new`">
          Create
        </router-link>
      </button>
      <button @click="loadItems(endpoint)">Reload</button>
    </div>
    <div class="loader">
      <flower-spinner :animation-duration="1500" :size="64" color="#e50cba" />
    </div>
    <div class="errorMsg">{{ errorMsg ? errorMsg : "" }}</div>
    <div class="table-element" v-show="headerInfos.length">
      <div class="table-header line-element">
        <div
          class="table-cell"
          v-for="(head, index) in headerInfos"
          :key="index"
        >
          {{ head.alias }}
        </div>
        <div class="table-cell action"></div>
      </div>
      <transition-group name="list" tag="div" class="table-content">
        <line-edit-element
          v-for="item in items"
          :key="`row-${item._id}`"
          :data="item"
          :attributes="headerInfos"
          :apiurl="endpoint"
          class="line-element"
          @item-removed="onItemRemoved($event)"
        />
      </transition-group>
      <div class="pages-container">
        <div
          class="pages-element"
          v-for="n in pageInfos.max"
          :class="[n === pageInfos.actual ? 'actual-page' : '']"
          :key="`pages-${n}`"
        >
          <button @click="onPageClicked(n, n === pageInfos.actual)">
            {{ n }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Getter, State, Action, namespace } from "vuex-class";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  IEndpointElement,
  IObject,
  IPrintInfos,
  IPrintInfosAlias,
  RequestTypes
} from "../types";
import { StringHelper, StorageHelper, apiHelper } from "../helpers";
import LineEditElement from "../components/LineEditElement.vue";
import { FlowerSpinner } from "epic-spinners";

// Types
const statusValues = RequestTypes.ERequestState;
// Modules
const itemStore = namespace("item");

@Component({
  components: {
    FlowerSpinner,
    LineEditElement
  }
})
export default class ListAdminPage extends Vue {
  // Mutations
  @itemStore.Mutation("changePage") changePage;
  // Action
  @itemStore.Action("loadItems") loadItems;
  // Getter
  @Getter("getEndpointInfoByName") getEndpointInfo;
  // State
  @itemStore.State("pageInfos") pageInfos;
  @itemStore.State("actualItems") items;
  @itemStore.State("status") status;
  @itemStore.State("errorMessgae") errorMsg;

  // Data
  private infos: IEndpointElement | null = null;
  private headerInfos: {
    alias: string;
    value: string;
  }[] = [];
  private classes: IObject = {
    loading: false,
    error: false
  };

  // Life cycle
  created() {}
  mounted() {
    const token = StorageHelper.getToken();
    if (token) {
      this.loadItems(this.endpoint);
    }
  }

  // Watcher
  @Watch("status")
  onStatusChanged(
    val: RequestTypes.ERequestState,
    oldVal: RequestTypes.ERequestState
  ) {
    this.classes.loading = val === statusValues.Loading;
    this.classes.error = val === statusValues.Error;
  }
  @Watch("$route", { immediate: true, deep: true })
  onRouteUpdate(to, from) {
    // get info from store
    this.infos = this.getEndpointInfo(StringHelper.normalize(to.name));

    // Reset class object
    this.classes = {
      error: false,
      loading: true
    };
  }

  // Computed
  get endpoint() {
    if (!this.infos) {
      return "";
    }
    return this.infos.endpoint
      ? this.infos.endpoint
      : StringHelper.normalize(this.infos.name);
  }

  // Watcher
  @Watch("items")
  refreshHeaderAttributes() {
    if (this.items.length === 0) {
      this.headerInfos = [];
      return;
    }
    // take first element attributes
    let printInfos: IPrintInfos = {
      exclude: [],
      alias: [],
      required: []
    };

    printInfos = this.infos && this.infos.print ? this.infos.print : printInfos;

    let result: IPrintInfosAlias[] = [];
    result = Object.keys(this.items[0]).reduce((arr, attribute) => {
      if (
        printInfos.exclude.length > 0 &&
        printInfos.exclude.find(a => attribute == a)
      ) {
        return arr;
      }

      // Find alias
      const alias = printInfos.alias.find(ele => ele.value === attribute);
      if (alias) {
        const title = StringHelper.ucFirst(alias.alias);
        arr.push({
          alias: title,
          value: alias.value,
          order: alias.order
        });
      } else {
        arr.push({
          value: attribute,
          alias: StringHelper.ucFirst(attribute)
        });
      }
      return arr;
    }, result);

    // Filter by order
    result = result.sort((a: IPrintInfosAlias, b: IPrintInfosAlias) => {
      const orderBasis = 5000;
      const sortA = a.order !== undefined ? a.order : orderBasis;
      const sortB = b.order !== undefined ? b.order : orderBasis;

      if (sortA === sortB) {
        return 0;
      }

      return sortA < sortB ? -1 : 1;
    });
    this.headerInfos = result;
  }

  // Events
  async onItemRemoved(id: string) {
    // reload items
    await this.loadItems(this.endpoint);

    // If not Item go to previous page
    if (this.pageInfos.actual > 1 && this.items.length === 0) {
      this.changePage(this.pageInfos.actual - 1);
      await this.loadItems(this.endpoint);
    }
  }

  onPageClicked(pageNumber: number, isActual: boolean) {
    if (isActual) {
      return;
    }
    console.log(pageNumber);
    this.changePage(pageNumber);
    this.loadItems(this.endpoint);
  }
}
</script>

<style scoped>
.element-admin-page {
  display: flex;
  flex-flow: column;
  background-color: aqua;
  align-content: center;
  min-height: 100%;
}

.toolbar,
.title {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  padding: 5px 0px 5px 0px;
}

.loader,
.errorMsg {
  display: none;
}

.pages-container {
  padding: 10px 20%;
  display: flex;
  flex-flow: row;
}

.pages-element {
  flex-grow: 1;
  background: white;
  margin: 5px 5px;
}

.pages-element.actual-page {
  background: slategrey;
}

.pages-element button {
  padding: 5px 5px;
  width: 100%;
  background: none;
  color: inherit;
  border: none;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

.table-element {
  margin: 10px 5px 10px 5px;
  display: flex;
  flex-flow: column;
  padding: 0;
}

.table-header,
.line-element {
  display: flex;
  flex-flow: row;
}
/* Transition */
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}

.list-enter {
  opacity: 0;
  transform: translateX(10px);
}

.list-leave-to {
  opacity: 0;
}

.table-header > .table-cell {
  background-color: slategrey;
  border: solid black;
  color: white;
}

.table-cell,
.table-content >>> .table-cell {
  word-wrap: break-word;
  box-sizing: border-box;
  padding: 0.5em 0.5em;
  background: white;
  overflow: hidden;
  border: solid white;
  flex-basis: 100%;
}

/* ON Loading */
.loading .loader {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.loading .toolbar {
  display: none;
}
/* On error */
.error .table-content {
  box-shadow: 0 4px 8px 0 #e50c0c, 0 6px 20px 0 #e50c0c;
}
.error .errorMsg {
  display: inline-block;
  color: tomato;
}
/* .toolbar button {} */
</style>
