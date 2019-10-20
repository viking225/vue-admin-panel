import * as RequestTypes from "./request";
import * as StorageTypes from "./storage";
import { IStore } from "./store";

interface IinfoType {
  id: Number;
  text: string;
  info: string;
}

interface IObject {
  [key: string] : any;
}

interface IPrintInfosAlias {
  value: string;
  alias: string;
  order?: Number;
  required?: Boolean;
}

interface IPrintInfos {
  exclude: string[]
  alias: IPrintInfosAlias[]
  required: string[]
}

interface IEndpointElement {
  name: string;
  endpoint?: string;
  print?: IPrintInfos;
  edit?: IPrintInfos;
  operations?: {
    find: Boolean;
    patch: Boolean;
    create: Boolean;
    delete: Boolean;
  }
}

interface IAppConfig {
  apiUrl: string;
}

export {
  IAppConfig,
  IinfoType,
  IObject,
  RequestTypes,
  IEndpointElement,
  IPrintInfos,
  IPrintInfosAlias,
  StorageTypes,
  IStore
};
