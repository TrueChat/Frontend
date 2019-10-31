import GroupService, {GroupCreationData, GroupDetails} from "../services/GroupService";

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

  loadDetails(groupId: string, onSuccess: (details: GroupDetails) => void, onFailure: () => void): void {
    this.useTimeout(() => {
      if (onSuccess) {
        onSuccess({
          groupId: "1234",
          name: "mock group",
          description: "mock description",
          members: [
            { id: "1", firstName: "Name", lastName: "Surname", name: "username"},
            { id: "2", firstName: "Name", lastName: "Surname", name: "username"},
            { id: "3", firstName: "Name", lastName: "Surname", name: "username"},
            { id: "4", firstName: "Name", lastName: "Surname", name: "username"},
            { id: "5", firstName: "Name", lastName: "Surname", name: "username"},
          ]
        })
      }
    })
  }

  useTimeout(func: () => void) {
    if (this.timeout) {
      setTimeout(func, this.timeout);
    } else {
      func();
    }
  }

  update(groupDetails: GroupDetails, onSuccess: () => void, onFailure: () => void): void {
    this.useTimeout(() => {
      !!onSuccess && onSuccess();
    });
  }

}