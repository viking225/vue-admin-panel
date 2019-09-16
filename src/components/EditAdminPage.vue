<template>
  <div class="edit-admin-page" :class="classes">
    <div class="title">
      <h1>
        {{ infos.name }}
        <span>
          {{ isPatch ? `: ${elementId}` : "" }}
        </span>
      </h1>
    </div>
    <div class="edit-content">
      <div
        v-for="(field, index) in fieldsInfos"
        class="field-content"
        :class="{ required: field.required }"
        :key="`field-${index}`"
      >
        <div class="field-title">
          {{ field.alias }}
        </div>
        <div class="field-value">
          <input v-model="item[field.value]" />
        </div>
      </div>
    </div>
    <div class="submit">
      <button @click="onSubmit()">
        {{ isPatch ? "Edit" : "Create" }}
      </button>
    </div>
    <div class="errorMsg">{{ errorMsg }}</div>
    <div class="loader">
      <flower-spinner :animation-duration="1500" :size="64" color="#e50cba" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import {
  IPrintInfos,
  IPrintInfosAlias,
  IObject,
  IEndpointElement
} from "../types";
import { FlowerSpinner } from "epic-spinners";
import { apiHelper, StringHelper } from "../helpers";

@Component({
  components: {
    FlowerSpinner
  }
})
export default class EditAdminPage extends Vue {
  // Props
  @Prop() private editInfos!: IEndpointElement;

  // Data
  private infos: IEndpointElement = this.editInfos;
  private elementId: number | null = null;
  private fieldsInfos: IPrintInfosAlias[] = [];
  private item: IObject = {};
  private errorMsg: string = "";
  private classes: IObject = {
    loading: false,
    error: false
  };

  // Life cycle
  async mounted() {
    console.log("mounted");
    if (this.isPatch) {
      this.loadItem();
    } else {
      // Find header infos with another way
      const item = await this.findFirstOfItems();
      if (item._id !== undefined) {
        this.updateFieldsInfos(item);
      }

      // If no values exist for model find another way
    }
  }

  // Computed
  get isPatch(): Boolean {
    return !!this.elementId;
  }

  get endpoint() {
    const name = this.infos.endpoint
      ? this.infos.endpoint
      : StringHelper.normalize(this.infos.name);
    return this.isPatch ? `${name}/${this.elementId}` : `${name}/`;
  }

  // Watcher
  @Watch("$route", { immediate: true, deep: true })
  onRouteUpdate(to, from) {
    // Cast to number
    const id = to.params.id;

    if (id !== "new") {
      this.elementId = id;
    }
  }

  // Method
  updateFieldsInfos(data: IObject) {
    console.log("launch update");
    const result = Object.keys(data).map(attribute => {
      let alias = StringHelper.ucFirst(attribute),
        value = attribute,
        required = false,
        order: Number | undefined = undefined;

      let excluedAttributeInfos = false;
      let excluded = ["_id", "__v"];
      let requiredAttributes: string[] = [];
      // find in aliases
      if (this.infos.edit) {
        excluded =
          this.infos.edit.exclude.length > 0
            ? this.infos.edit.exclude
            : excluded;

        requiredAttributes =
          this.infos.edit.required.length > 0
            ? this.infos.edit.required
            : requiredAttributes;

        // Find alias
        const attributeInfos = this.infos.edit.alias.find(
          element => element.value === attribute
        );
        alias = attributeInfos ? attributeInfos.alias : alias;
        order =
          attributeInfos && attributeInfos.order !== undefined
            ? attributeInfos.order
            : undefined;
      }

      // Find exclude
      excluedAttributeInfos = !!excluded.find(element => element === attribute);
      if (excluedAttributeInfos) {
        return null;
      }

      // find required
      required = !!requiredAttributes.find(attr => attr === attribute);
      return {
        value,
        alias,
        order,
        required
      };
    });

    this.fieldsInfos = result.filter(e => e) as IPrintInfosAlias[];
    // Sort by order define in the config
    // By default required fields come first
    this.fieldsInfos = this.fieldsInfos.sort((a, b) => {
      const valRequired = 500;
      const valUnknown = 5000;
      let sortA: Number = a.required ? valRequired : valUnknown;
      let sortB: Number = b.required ? valRequired : valUnknown;

      sortA = a.order !== undefined ? a.order : sortA;
      sortB = b.order !== undefined ? b.order : sortB;

      if (sortA === sortB) {
        return 0;
      }

      return sortA < sortB ? -1 : 1;
    });
  }

  async findFirstOfItems(): Promise<IObject> {
    let item = {};
    const fetchParams = {
      method: "GET"
    };

    let response: any = null;

    try {
      response = await apiHelper.request(this.endpoint, fetchParams);
    } catch (e) {
      return item;
    }
    if (response.status === 200 && response.json) {
      const { data } = response.json;
      item = data.length > 0 ? data[0] : item;
    }

    return item;
  }

  async loadItem() {
    if (this.classes.loading) {
      return false;
    }

    this.classes = {
      loading: false,
      error: false
    };

    const fetchParams = {
      method: "GET"
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
      return;
    }

    this.item = response.json;
    this.updateFieldsInfos(this.item);
  }

  async onSubmit() {
    // swith betweeen post and patch thanks to prop
    if (this.classes.loading) {
      return false;
    }

    // Validate
    const validate = this.validateRequired();
    if (!validate) {
      this.classes.error = true;
      this.errorMsg = "Required fields are not validated";
      return false;
    }

    // Launch request
    this.classes = {
      loading: true,
      error: false
    };

    const fetchParams = {
      method: this.isPatch ? "PATCH" : "POST",
      body: JSON.stringify(this.item)
    };

    let response: any = null;

    try {
      response = await apiHelper.request(this.endpoint, fetchParams);
    } catch (e) {
      this.classes = {
        error: false,
        loading: false
      };
      this.errorMsg = "Unknown error";
      return;
    }
    this.classes.loading = false;
    if (response.status !== (this.isPatch ? 200 : 201)) {
      this.classes.error = true;
      this.errorMsg = `${response.json.message}`;
      return;
    }

    this.item = response.json;
    this.elementId = this.item._id;
    // Redirect
    console.log(this.endpoint);
    console.log(this.$route);

    this.$router.push({
      path: `/${this.endpoint}`
    });
  }

  validateRequired(): Boolean {
    const unValidated = this.fieldsInfos.some(fieldInfos => {
      if (!fieldInfos.required) {
        return false;
      }
      return !this.item[fieldInfos.value] || this.item[fieldInfos.value] === "";
    });
    return !unValidated;
  }
}
</script>
<style scoped>
.edit-admin-page {
  background: greenyellow;
  display: flex;
  min-height: 100%;
  padding: 0% 10%;
  flex-flow: column;
  text-align: center;
}

.edit-content {
  display: flex;
  flex-flow: column;
}

.field-content {
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
}

.field-title,
.field-value {
  padding: 0 5%;
}

.field-title {
  flex: 1 1;
  text-align: left;
}

.required .field-title::after {
  content: "*";
  color: tomato;
}
.field-value {
  flex: 2 1;
}

.field-value > input {
  min-width: 100%;
}

.submit {
  padding: 5% 10%;
  display: flex;
}

.submit > button {
  padding: 2%;
  flex: 1 1 20%;
}

.loader,
.errorMsg {
  display: none;
}

.loader > div {
  flex: 1 1 auto;
}

/* On loading */
.loading .loader {
  display: flex;
}

/* On error */
.error .edit-content {
  box-shadow: 0 4px 8px 0 #e50c0c, 0 6px 20px 0 #e50c0c;
}
.error .errorMsg {
  display: inline-block;
  color: tomato;
}
</style>
