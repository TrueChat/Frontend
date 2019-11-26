import GroupService, {GroupCreationData, GroupDetails} from "../GroupService";
import {ResponseHandler, Response} from "../types";

export default class MockGroupService implements GroupService {
  private readonly timeout?: number;
  constructor(timeout?: number) {
    this.timeout = timeout;
  }

  createGroup(data: GroupCreationData, onSuccess?: ResponseHandler, onFailure?: ResponseHandler): void {
    this.useTimeout(() => {
      if (onSuccess) {
        onSuccess(this.mockResponse());
      }
    });
  }

  findAll(onSuccess?: ResponseHandler<GroupDetails[]> | undefined, onFailure?: ResponseHandler<any> | undefined): void {
    this.useTimeout(() => {
      if (!onSuccess) {
        return;
      }

      const data = [];
      for (let i = 0; i < 20; i++) {
        data.push(this.mockGroup(i));
      }

      onSuccess({
        status: 200,
        headers: { },
        data: data
      })
    });
  }

  loadDetails(groupId: string, onSuccess: (details: GroupDetails) => void, onFailure: () => void): void {
    this.useTimeout(() => {
      if (onSuccess) {
        onSuccess(this.mockGroup(groupId));
      }
    })
  }

  private mockGroup(id: any) : GroupDetails {
    return {
      groupId: id,
      name: `mock group ${id}`,
      description: "mock description",
      creator: { id: "1", firstName: "Name", lastName: "Surname", username: "mock_user"},
      isDialog: false,
      lastMessage: "mock message",
      members: [
        { id: "1", firstName: "Name", lastName: "Surname", username: "mock_user"},
        { id: "2", firstName: "Name", lastName: "Surname", username: "username"},
        { id: "3", firstName: "Name", lastName: "Surname", username: "username"},
        { id: "4", firstName: "Name", lastName: "Surname", username: "username"},
        { id: "5", firstName: "Name", lastName: "Surname", username: "username"},
      ]
    };
  }

  useTimeout(func: () => void) {
    if (this.timeout) {
      setTimeout(func, this.timeout);
    } else {
      func();
    }
  }

  update(groupDetails: GroupDetails, onSuccess?: ResponseHandler, onFailure?: ResponseHandler): void {
    this.useTimeout(() => {
      !!onSuccess && onSuccess(this.mockResponse());
    });
  }

  addUser(groupId: string, username: string, onSuccess?: ResponseHandler, onFailure?: ResponseHandler): void {
    this.useTimeout(() => {
      onSuccess && onSuccess(this.mockResponse());
    })
  }

  removeUser(groupId: string, username: string, onSuccess?: ResponseHandler, onFailure?: ResponseHandler): void {
    this.useTimeout(() => {
      onSuccess && onSuccess(this.mockResponse());
    });
  }

  banUser(groupId: string, username: string, onSuccess?: ResponseHandler, onFailure?: ResponseHandler ): void {
    this.useTimeout(() => {
      onSuccess && onSuccess(this.mockResponse())
    });
  }

  kickUser(groupId: string, username: string, onSuccess?: ResponseHandler, onFailure?: ResponseHandler ): void {
    this.useTimeout(() => {
      onSuccess && onSuccess(this.mockResponse());
    })
  }

  private mockResponse() : Response {
    return {
      headers: [],
      status: 200,
      data: "Mock Response"
    }
  }

  leaveGroup(groupId: string, onSuccess: (response: Response<any>) => void): void {
    this.useTimeout(() => {
      onSuccess && onSuccess(this.mockResponse());
    })
  }

}