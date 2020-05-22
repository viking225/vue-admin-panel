import { app } from "../config";
import { StorageHelper } from ".";
import { IResponse } from "@/types/request";

const request = async (
  endpoint: string,
  fetchParams: RequestInit = {}
): Promise<IResponse> => {
  const headers = {
    "Content-type": "application/json",
  };
  const token = StorageHelper.getToken();
  headers["Authorization"] = token ? token : undefined;

  if (!fetchParams.headers) {
    fetchParams.headers = headers;
  }

  const res = <Response>await fetch(`${app.apiUrl}/${endpoint}`, fetchParams);
  const response = await res.json();

  return {
    status: res ? res.status : 500,
    json: response,
  };
};

export { request };
