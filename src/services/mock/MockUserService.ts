import UserService, {UserProfile} from "../UserService";
import {RegistrationData} from "../AuthService";
import {ConstraintViolation, Response, Request} from "../types";

export default class MockUserService implements UserService {
  private timeout?: number;

  constructor(timeout?: number) {
    this.timeout = timeout;
  }

  logout(doAfter: () => void): void {
    this.useTimeout(() => {
      doAfter()
    });
  }

  loadProfileForCurrentUser(): Promise<UserProfile> {
    return new Promise<UserProfile>((resolve, reject) => {
      resolve({
        username: "mock_user",
        first_name: "mock_fist_name",
        last_name: "mock_last_name",
        about: "mock_about",
        images: []
      });
    });
  }

  login(username: string, password: string, onSuccess?: () => void, onFailure?: (violations: ConstraintViolation[]) => void) {
    this.useTimeout(() => {
      if (onSuccess) {
        onSuccess();
      }
    });
  }

  userIsPresent(): boolean {
    return true;
  }

  updateProfileForCurrentUser(userProfile: UserProfile, onSuccess?: () => void, onFailure?: (violations: ConstraintViolation[]) => void) {
    this.useTimeout(() => {
      if (onSuccess) {
        onSuccess();
      }
    });
  }

  register(data: RegistrationData, onSuccess?: () => void, onFailure?: (violations: ConstraintViolation[]) => void) {
    this.useTimeout(() => {
      if (onSuccess) {
        onSuccess();
      }
    });
  }

  private useTimeout(func: () => void) {
    if (this.timeout) {
      setTimeout(func, this.timeout)
    } else {
      func();
    }
  }

  searchUsers(searchString: string): Promise<UserProfile[]> {
    return new Promise<UserProfile[]>((resolve, reject) => {
      this.useTimeout(() => {
        resolve([
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about", images: []},
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about", images: []},
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about", images: []},
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about", images: []},
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about", images: []},
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about", images: []},
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about", images: []},
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about", images: []}
        ]);
      })
    })
  }

  getCurrentUser(): string {
    return "mock_user";
  }

  loadProfile(username: string) : Promise<UserProfile> {
    return new Promise<UserProfile>((resolve, reject) => {
      resolve({ username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about",
        images: [{
          imageURL: "data:image/jpeg;base64,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"
        }]
      });
    })
  }

  sendAuthorizedRequest(
      request: Request,
      onSuccess: (response: Response<any>) => void,
      onFailure: (response: Response<any>) => void): void { }

  uploadImage(file: File, onSuccess: (response: Response<any>) => void, onFailure: (response: Response<any>) => void): void {
    this.useTimeout(() => {
      onSuccess && onSuccess({
        headers: { },
        status: 200,
        data: undefined
      });
    });
  }

}