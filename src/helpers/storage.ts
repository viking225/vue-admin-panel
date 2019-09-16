import { StorageTypes } from "../types";

const defaultAuth: StorageTypes.IAuthStorage = {
  token: "",
  expiresIn: ""
};

const initAuth = () => {
  const auth: StorageTypes.IAuthStorage = defaultAuth;
  if (!localStorage.auth) {
    localStorage.auth = JSON.stringify(auth);
  }
};

const getAuth = (): StorageTypes.IAuthStorage => {
  return localStorage.auth
    ? (JSON.parse(localStorage.auth) as StorageTypes.IAuthStorage)
    : defaultAuth;
};

const setAuth = (auth: StorageTypes.IAuthStorage) => {
  localStorage.auth = JSON.stringify(auth);
};

class Storage implements StorageTypes.IStorage {
  setToken(token: string) {
    initAuth();
    const auth = getAuth();
    auth.token = token;

    setAuth(auth);
  }
  getToken(): string | null {
    const auth = getAuth();
    return auth.token.length > 0 ? auth.token : null;
  }

  setTokenExpireDate(date: string) {
    const auth = getAuth();
    auth.expiresIn = date;

    setAuth(auth);
  }

  getTokenExpireDate(): string | null {
    const auth = getAuth();
    return auth.expiresIn.length > 0 ? auth.expiresIn : null;
  }
}

export default new Storage();
