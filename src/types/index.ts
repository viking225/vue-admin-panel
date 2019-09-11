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

interface IAppConfig {
  apiUrl: string;
}

interface IAuthStorage {
  token: string;
  expiresIn: string
}

interface IStorage {
  setToken(token: string);
  getToken(): string | null;
  setTokenExpireDate(date: string);
  getTokenExpireDate(): string | null;
}

export { IAppConfig, IStorage, IinfoType, IObject, RequestTypes, IEndpointElement, IPrintInfos, IPrintInfosAlias, IAuthStorage };
