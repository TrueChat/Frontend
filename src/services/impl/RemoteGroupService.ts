import GroupService, { GroupMember } from "../GroupService";
import { GroupCreationData, GroupDetails } from "../GroupService"
import {ResponseHandler, Response, ConstraintViolation} from "../types"
import RemoteUserService from "./RemoteUserService";

export default class RemoteGroupService implements GroupService {
  private readonly userService: RemoteUserService; 
  private readonly baseUrl: string;

  constructor(baseUrl: string, userService: RemoteUserService) {
    this.userService = userService;
    this.baseUrl = baseUrl;
  }

  public createGroup(data: GroupCreationData, onSuccess?: ResponseHandler<string>, onFailure?: ResponseHandler<ConstraintViolation[]>): void {
    this.userService.sendAuthorizedRequest({
        method: "POST",
        url: `${this.baseUrl}/chats/`,
        body: data
      },
      response => {
        if (onSuccess) {
          onSuccess({
            headers: response.headers,
            data: response.data.id,
            status: response.status
          });
        }
      },
      response => {
        if (onFailure) {
          response.data = this.convertServerViolationsToConstraintViolations(response);
          onFailure(response);
        }
      }
    );
  }  
  
  public loadDetails(groupId: string, onSuccess: (details: GroupDetails) => void, onFailure: () => void): void {
    const _onSuccess = (response: Response<any>) => {
      onSuccess(this.mapChatDataToGroupDetails(response.data));
    };

    const _onFailure = (response: Response<any>) => {
      onFailure();
    };

    this.userService.sendAuthorizedRequest({
      method: "GET",
      url: `${this.baseUrl}/chats/${groupId}`,
    }, _onSuccess, _onFailure);
  }

  private mapChatDataToGroupDetails(chat: any) : GroupDetails {
    return {
      name: chat.name as string,
      description: chat.description as string,
      groupId: chat.id as string,
      creator: this.mapChatMemberToGroupMember(chat.creator),
      isDialog: chat.is_dialog,
      members: chat.users.map(this.mapChatMemberToGroupMember),
    }
  }

  private mapChatMemberToGroupMember(chatMember: any) : GroupMember {
    if (chatMember === null) {
      return { id: "", username: "", firstName: "", lastName: "" };
    }
    return {
      id: chatMember.id,
      username: chatMember.username,
      firstName: chatMember.first_name,
      lastName: chatMember.last_name
    }
  }

  update(groupDetails: GroupDetails, onSuccess: ResponseHandler<any>, onFailure: ResponseHandler<ConstraintViolation[]>): void {
    this.userService.sendAuthorizedRequest({
        method: "PUT",
        url: `${this.baseUrl}/chats/${groupDetails.groupId}/`,
        body: groupDetails
      },
      this.wrapHandler(onSuccess),
      (response) => {
        if (onFailure) {
          response.data = this.convertServerViolationsToConstraintViolations(response);
          onFailure(response);
        }
      }
    );
  }

  private convertServerViolationsToConstraintViolations(response: Response<any>) {
    let violations: ConstraintViolation[] = [];
    for (let key of Object.keys(response.data)) {
      violations.push({
        violates: true,
        property: key,
        message: response.data[key][0]
      });
    }
    return violations;
  }

  addUser(groupId: string, username: string, onSuccess?: ResponseHandler<any>, onFailure?: ResponseHandler<any>): void {
    this.userService.sendAuthorizedRequest({
      method: "POST",
      url: `${this.baseUrl}/chats/${groupId}/add_member/${username}/`
    }, this.wrapHandler(onSuccess), this.wrapHandler(onFailure));
  }
  
  removeUser(groupId: string, username: string, onSuccess?: ResponseHandler<any>, onFailure?: ResponseHandler<any>): void {
    this.userService.sendAuthorizedRequest({
      method: "DELETE",
      url: `${this.baseUrl}/chats/${groupId}/delete_member/${username}/`
    }, this.wrapHandler(onSuccess), this.wrapHandler(onFailure))
  }
  
  banUser(groupId: string, username: string, onSuccess?: ResponseHandler<any>, onFailure?: ResponseHandler<any>): void {
    this.userService.sendAuthorizedRequest({
      method: "PUT",
      url: `${this.baseUrl}/chats/${groupId}/ban_member/${username}/`
    }, this.wrapHandler(onSuccess), this.wrapHandler(onFailure));
  }
  
  kickUser(groupId: string, username: string, onSuccess?: ResponseHandler<any>, onFailure?: ResponseHandler<any>): void {
    this.userService.sendAuthorizedRequest({
      method: "DELETE",
      url: `${this.baseUrl}/chats/${groupId}/delete_member/${username}/`
    }, this.wrapHandler(onSuccess), this.wrapHandler(onFailure));
  }

  private wrapHandler(handler?: ResponseHandler<any>) : ResponseHandler<any> {
    return (response: Response<any>) => handler && handler(response);
  }

  findAll(onSuccess?: ResponseHandler<GroupDetails[]>, onFailure?: ResponseHandler<any>): void {
    this.userService.sendAuthorizedRequest({
        method: "GET",
        url: `${this.baseUrl}/chats/`
      },
      response => {
        if (!onSuccess) {
          return;
        }
        const data = response.data.map((chat: any, i: number) => {
          return this.mapChatDataToGroupDetails(chat);
        });
        onSuccess({
          status: response.status,
          headers: response.headers,
          data: data
        })
      },
      this.wrapHandler(onFailure)
    );
  }

}