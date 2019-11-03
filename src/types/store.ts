import { IEndpointElement, IObject } from ".";
import { ERequestState } from "./request";

interface IPagesInfos {
  actual: number;
  max: number;
  limit: number;
}

interface IAuthStore {
  token: {
    value: string | null;
    expiresIn: string | null;
  };
  status: ERequestState;
  errorMessage: string;
}

interface IitemStore {
  actualItems: IObject[];
  pageInfos: IPagesInfos;
  status: ERequestState;
  errorMessage: String;
}

interface IStore {
  endpoints: IEndpointElement[];
}

export { IStore, IAuthStore, IPagesInfos, IitemStore };
