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
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public register(username: string, email: string, password: string) : Promise<RegistrationResponse> {
    const credentials = {
      username: username,
      email: email,
      password1: password,
      password2: password
    };
    return axios
      .post(`${this.baseUrl}/rest-auth/registration/`, credentials)
      .then(response => response.data);
  }

  public login(username: string, email: string, password: string) : Promise<LoginResponse> {
    const credentials = {
      username: username,
      email: email,
      password: password
    };
    return axios
      .post(`${this.baseUrl}/rest-auth/login/`, credentials)
      .then(response => response.data);
  }

  public logout() : Promise<LogoutResponse> {
    return axios
      .post(`${this.baseUrl}/rest-auth/logout/`)
      .then(response => response.data);
  }

}