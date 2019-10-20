interface IAuthRequest {
  userName: string;
  password: string;
}

enum ERequestState {
  Loading,
  Error,
  Success,
  Base
}

export { IAuthRequest, ERequestState };