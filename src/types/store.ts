import { IEndpointElement, IObject } from ".";
import { ERequestState } from "./request";

interface IPagesInfos {
  actual: number;
  max: number;
}

interface IAuthStore {
  token: {
    value: string | null;
    expiresIn: string | null;
  };
  status: ERequestState;
  errorMessage: string;
}

interface IStore {
  endpoints: IEndpointElement[];
  actualItems: IObject[];
  pageInfos: IPagesInfos;
}

export { IStore, IAuthStore, IPagesInfos };
