import RemoteAuthService from "./RemoteAuthService";
import Cookies from "js-cookie";
import axios, {AxiosError} from "axios";
import UserService, {
  SubmissionFailureHandler,
  SubmissionSuccessHandler,
  UserProfile
} from "../UserService";
import {RegistrationData} from "../AuthService";
import {Headers, Response, Request, ConstraintViolation, ResponseHandler} from "../types";

type UserData = {
  authToken: string,
  username: string
}

type ServerErrorResponse = {
  [key: string]: string[]
}

export default class RemoteUserService implements UserService {
  private readonly baseUrl: string;
  private readonly authService: RemoteAuthService;
  constructor(baseUrl: string, authService: RemoteAuthService) {
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
        const userData = {authToken: response.key, username: ""};
        this.saveUserToCookies(userData);
        this.loadProfileForCurrentUser()
          .then(profile => {
            this.saveUserToCookies({
              authToken: userData.authToken,
              username: profile.username
            });
            if (onSuccess) {
              onSuccess();
            }
          });
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

  public searchUsers(searchString: string): Promise<UserProfile[]> {
    return new Promise<UserProfile[]>((resolve, reject) => {
      this.sendAuthorizedRequest({
        method: "GET",
        url: `${this.baseUrl}/profiles/${searchString}`
      }, response => {
        resolve(response.data);
      }, response => {
        reject(response);
      })
    });
  }

  public loadProfile(username: string): Promise<UserProfile> {
    return new Promise((resolve, reject) => {
      this.sendAuthorizedRequest({
        method: "GET",
        url: `${this.baseUrl}/profile/${username}/`
      }, response => {
        resolve(response.data);
      }, response => {
        reject(response);
      });
    });
  }


  sendAuthorizedRequest(
    request: Request,
    onSuccess: (response: Response<any>) => void,
    onFailure: (response: Response<any>) => void
  ) {
    const currentUser = Cookies.getJSON("userData") as UserData|undefined;

    if (!currentUser) {
      throw new Error("no user is present");
    }

    const headers = this.mergeHeaders(
      {"Authorization": `Token ${currentUser.authToken}`},
      request.headers ? request.headers : { }
    );


    // @ts-ignore
    axios({
      headers: headers,
      method: request.method,
      url: request.url,
      data: request.body,
      params: request.params,
      responseType: request.responseType ? request.responseType : "json",
    })
    .then((response: any) => {
      onSuccess({
        headers: response.headers,
        data: response.data,
        status: response.status
      });
    })
    .catch((error: AxiosError) => {
      onFailure({
        headers: error.response ? error.response.headers : [],
        data: error.response && error.response.data,
        status: error.response ? error.response.status: 400
      });
    })
  }

  public logout(doAfter: () => void): void {
    this.authService
      .logout()
      .then(() => {
        this.clearState();
        doAfter();
      });
  }


  private mergeHeaders(h1: Headers, h2: Headers) : Headers {
    const result: Headers = { };
    for (let header of Object.keys(h1)) {
      result[header] = h1[header];
    }
    for (let header of Object.keys(h2)) {
      if (!result[header]) {
        result[header] = h2[header];
      }
    }
    return result;
  }

  public getCurrentUser(): string {
    return (Cookies.getJSON("userData") as UserData).username;
  }

  uploadImage(file: File, onSuccess: ResponseHandler<any>, onFailure: ResponseHandler<any>): void {
    const formData = new FormData();
    formData.set("file", file);
    this.sendAuthorizedRequest({
        url: `${this.baseUrl}/profile/upload_image/`,
        method: "POST",
        body: formData
      },
      response => onSuccess(response),
      response => onFailure(response)
    );
  }
}