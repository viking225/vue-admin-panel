import * as RequestTypes from './request';

interface IinfoType {
  id: Number;
  text: string;
  info: string;
}

interface IObject {
  [key: string] : any;
}

export { IinfoType, IObject, RequestTypes };
