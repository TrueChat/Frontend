import axios from "axios";

interface RegistrationResponse {
  key: string
}

interface LoginResponse {
  key: string
}

interface LogoutResponse {
  detail: string
}

export default class AuthService {
  private readonly domain: string;

  constructor(domain: string) {
    this.domain = domain;
  }

  public register(username: string, email: string, password: string) : Promise<RegistrationResponse> {
    const credentials = {
      username: username,
      email: email,
      password1: password,
      password2: password
    };
    return axios.post(`${this.domain}/rest-auth/registration/`, credentials);
  }

  public login(username: string, email: string, password: string) : Promise<LoginResponse> {
    const credentials = {
      username: username,
      email: email,
      password: password
    };
    return axios.post(`${this.domain}/rest-auth/login/`, credentials);
  }

  public logout() : Promise<LogoutResponse> {
    return axios.post(`${this.domain}/rest-auth/logout/`);
  }

}