import { IObject } from '.';

interface IAuthRequest {
  userName: string;
  password: string;
}

interface IResponse {
  status: number;
  json: IObject
}

enum ERequestState {
  Loading,
  Error,
  Success,
  Base
}

export { IAuthRequest, ERequestState, IResponse };