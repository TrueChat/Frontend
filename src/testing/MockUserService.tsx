import UserService, {UserProfile} from "../services/UserService";
import {ConstraintViolation} from "../pages/auth/AuthenticationPage";
import AuthService, {RegistrationData} from "../services/AuthService";

export default class MockUserService extends UserService {

  private timeout?: number;

  constructor(timeout?: number) {
    super("", new AuthService(""));
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

}