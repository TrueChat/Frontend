import {ConstraintViolation} from "../../pages/auth/AuthenticationPage";
import UserService, {UserProfile} from "../UserService";
import {RegistrationData} from "../AuthService";

export default class MockUserService implements UserService{

  private timeout?: number;

  constructor(timeout?: number) {
    this.timeout = timeout;
  }

  loadProfileForCurrentUser(): Promise<UserProfile> {
    return new Promise<UserProfile>((resolve, reject) => {
      resolve({
        username: "mock_user",
        first_name: "mock_fist_name",
        last_name: "mock_last_name",
        about: "mock_about"
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
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about"},
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about"},
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about"},
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about"},
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about"},
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about"},
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about"},
          { username: "mock_user", first_name: "Name", last_name: "Surname", about: "mock_about"}
        ]);
      })
    })
  }

  getCurrentUser(): string {
    return "mock_userss";
  }

  loadProfile(username: string) : Promise<UserProfile> {
    return new Promise<UserProfile>((resolve, reject) => {
      resolve({ username: "mock_usersdsadsa", first_name: "Name", last_name: "Surname", about: "mock_about"});
    })
  }

}