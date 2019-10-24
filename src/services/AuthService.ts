import axios from "axios";

interface RegistrationResponse {
}

interface LoginResponse {
  key: string
}

interface LogoutResponse {
  detail: string
}

export type RegistrationData = {
  username: string
  email: string,
  password: string,
  confirmPassword: string
}

export default class AuthService {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public register(data: RegistrationData) : Promise<RegistrationResponse> {
    const credentials = {
      username: data.username,
      email: data.email,
      password1: data.password,
      password2: data.confirmPassword
    };
    return axios
      .post(`${this.baseUrl}/rest-auth/registration/`, credentials)
      .then(response => response.data);
  }

  public login(username: string, password: string) : Promise<LoginResponse> {
    const credentials = {
      username: username,
      password: password
    };
    return axios
      .post(`${this.baseUrl}/rest-auth/login/`, credentials)
      .then(response => response.data)
  }

  public logout() : Promise<LogoutResponse> {
    return axios
      .post(`${this.baseUrl}/rest-auth/logout/`)
      .then(response => response.data);
  }

}