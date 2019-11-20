import {RegistrationData} from "./AuthService";
import {ConstraintViolation, Request, Response} from "./types";

export type UserProfile = {
  first_name: string,
  last_name: string,
  username: string,
  about: string
}

export type SubmissionFailureHandler = (violations: ConstraintViolation[]) => void;
export type SubmissionSuccessHandler = () => void;

export default interface UserService {

  login(
    username: string,
    password: string,
    onSuccess?: SubmissionSuccessHandler,
    onFailure?: SubmissionFailureHandler
  ) : void;

  register(
    data: RegistrationData,
    onSuccess?: SubmissionSuccessHandler,
    onFailure?: SubmissionFailureHandler
  ) : void;

  loadProfileForCurrentUser() : Promise<UserProfile>;

  loadProfile(username: string) : Promise<UserProfile>;

  updateProfileForCurrentUser(
    profile: UserProfile,
    onSuccess?: SubmissionSuccessHandler,
    onFailure?: SubmissionFailureHandler
  ) : void;

  getCurrentUser() : string;

  userIsPresent(): boolean;

  searchUsers(searchString: string): Promise<UserProfile[]>

  sendAuthorizedRequest(
    request: Request,
    onSuccess: (response: Response<any>) => void,
    onFailure: (response: Response<any>) => void
  ) : void;
}