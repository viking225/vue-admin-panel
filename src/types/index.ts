import * as RequestTypes from './request';

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
}

interface IPrintInfos {
  exclude: string[]
  alias: IPrintInfosAlias[]
}

interface IEndpointElement {
  name: string;
  endpoint?: string;
  print?: IPrintInfos;
}

export { IinfoType, IObject, RequestTypes, IEndpointElement, IPrintInfos, IPrintInfosAlias };
