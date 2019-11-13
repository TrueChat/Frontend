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
    }, response => {
      if (onSuccess) {
        onSuccess({
          headers: response.headers,
          data: response.data.id,
          status: response.status
        });
      }
    }, this.wrapHandler(onFailure));
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
      members: chat.users.map(this.mapChatMemberToGroupMember)
    }
  }

  private mapChatMemberToGroupMember(chatMember: any) : GroupMember {
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
    }, this.wrapHandler(onSuccess), this.wrapHandler(onFailure));
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

}