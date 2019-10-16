import AuthService from "./AuthService";
import {SubmissionFailureHandler, SubmissionSuccessHandler} from "../pages/auth/components/AuthForm";
import {ConstraintViolation} from "../pages/auth/AuthenticationPage";
const Cookies = require("js-cookie");

type UserData = {
  authToken: string
}

type ServerErrorResponse = {
  [key: string]: string[]
}

export default class UserService {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public login(
      username: string,
      password: string,
      onSuccess?: SubmissionSuccessHandler,
      onFailure?: SubmissionFailureHandler) {

    this.authService
      .login(username, password)
      .then(response => {
        this.saveUserToCookies({
          authToken: response.key
        });
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch(error => {
        if (onFailure) {
          onFailure(this.translateConstraintViolations(error.response.data));
        }
      });
  }


  public register(
      username: string,
      email: string,
      password: string,
      onSuccess?: SubmissionSuccessHandler,
      onFailure?: SubmissionFailureHandler) {

    this.authService
      .register(username, email, password)
      .then(response => {
        this.saveUserToCookies({
          authToken: response.key
        });
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch(error => {
        if (onFailure) {
          onFailure(this.translateConstraintViolations(error.response.data));
        }
      });
  }

  private saveUserToCookies(userData: UserData) {
    Cookies.set("userData", userData);
  }

  private translateConstraintViolations(errors: ServerErrorResponse) {
    const violations: ConstraintViolation[] = [];
    for (let key of Object.keys(errors)) {
      let violation: ConstraintViolation;
      if (key === "password1") {
        violation = this.newViolation("password", errors[key][0]);
      } else if (key === "password2") {
        violation = this.newViolation("confirmPassword", errors[key][0]);
      } else if (key === "username") {
        violation = this.newViolation("login", errors[key][0]);
      } else if (key === "non_field_errors") {
        violation = this.newViolation("_other", errors[key][0]);
      } else {
        violation = this.newViolation(key, errors[key][0]);
      }
      violations.push(violation)
    }
    return violations;
  }

  private newViolation(property: string, message: string) : ConstraintViolation {
    return {
      property: property, violates: true, message: message
    }
  }
}