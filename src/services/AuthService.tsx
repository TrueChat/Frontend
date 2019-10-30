export type RegistrationResponse =  {
}

export type LoginResponse = {
  key: string
}

export type LogoutResponse = {
  detail: string
}

export type RegistrationData = {
  username: string
  email: string,
  password: string,
  confirmPassword: string
}

export default interface AuthService {

  register: (data: RegistrationData) => Promise<RegistrationResponse>

  login: (username: string, password: string) => Promise<LoginResponse>

  logout: () => Promise<LogoutResponse>
}
