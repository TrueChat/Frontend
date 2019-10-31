import GroupService, {GroupCreationData} from "../services/GroupService";

export default class MockGroupService implements GroupService {

  private readonly timeout?: number;

  constructor(timeout?: number) {
    this.timeout = timeout;
  }

  createGroup(data: GroupCreationData, onSuccess?: () => void, onFailure?: () => void): void {
    this.useTimeout(() => {
      console.log(data);
      if (onSuccess) {
        onSuccess();
      }
    });
  }

  useTimeout(func: () => void) {
    if (this.timeout) {
      setTimeout(func, this.timeout);
    } else {
      func();
    }
  }

}