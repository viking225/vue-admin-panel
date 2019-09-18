import { app } from "../config";
import { StorageHelper } from ".";

const request = async (endpoint: string, fetchParams: RequestInit = {}) => {
  const headers = {
    "Content-type": "application/json"
  };
  const token = StorageHelper.getToken();
  headers["Authorization"] = token ? token : undefined;

  if (!fetchParams.headers) {
    fetchParams.headers = headers;
  }

  const res = await fetch(`${app.apiUrl}/${endpoint}`, fetchParams);
  const response = await res.json();

  return {
    status: res.status,
    json: response
  };
};

export { request };
