interface IAuthStorage {
  token: string;
  expiresIn: string;
}

interface IStorage {
  setToken(token: string);
  getToken(): string | null;
  setTokenExpireDate(date: string);
  getTokenExpireDate(): string | null;
}

export { IAuthStorage, IStorage };
