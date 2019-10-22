import AuthService, {RegistrationData} from "./AuthService";
import {ConstraintViolation} from "../pages/auth/AuthenticationPage";
import Cookies from "js-cookie";
import axios from "axios";

type UserData = {
  authToken: string,
  username: string
}

type ServerErrorResponse = {
  [key: string]: string[]
}

export type UserProfile = {
  first_name: string,
  last_name: string,
  username: string,
  about: string
}

export type SubmissionFailureHandler = (violations: ConstraintViolation[]) => void;
export type SubmissionSuccessHandler = () => void;

export default class UserService {
  private readonly baseUrl: string;
  private readonly authService: AuthService;

  constructor(baseUrl: string, authService: AuthService) {
    this.authService = authService;
    this.baseUrl = baseUrl;
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
          authToken: response.key,
          username: username
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
      data: RegistrationData,
      onSuccess?: SubmissionSuccessHandler,
      onFailure?: SubmissionFailureHandler) {
    this.clearState();
    this.authService
      .register(data)
      .then(response => {
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

  public userIsPresent() : boolean {
    return Cookies.get("userData") !== undefined;
  }

  private saveUserToCookies(userData: UserData) {
    Cookies.set("userData", userData);
  }

  private clearState() {
    Cookies.remove("userData");
  }

  // TODO fix
  public loadProfileForCurrentUser() : Promise<UserProfile> {
    let userData: UserData = Cookies.getJSON("userData");
    return axios
      .get(`${this.baseUrl}/profile/`, {
        headers: {
          "Authorization": `Token ${userData.authToken}`
        }
      })
      .then(response => response.data);
  }

  public updateProfileForCurrentUser(userProfile: UserProfile, onSuccess?: SubmissionSuccessHandler, onFailure?: SubmissionFailureHandler) {
    let userData: UserData = Cookies.getJSON("userData");
    axios
      .put(`${this.baseUrl}/profile/`, userProfile, {
        headers: {
          "Authorization": `Token ${userData.authToken}`
        }
      })
      .then(_ => {
        if (onSuccess) {
          onSuccess()
        }
        userData.username = userProfile.username;
        Cookies.set("userData", userData);
      })
      .catch(error => {
        if (onFailure) {
          onFailure(this.translateConstraintViolations(error.response.data));
        }
      })
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