import {ConstraintViolation, ResponseHandler} from "./types";

export type GroupCreationData = {
  name: string,
  description: string
}

export type GroupData = {
  name: string,
  description: string
}

export type GroupMember = {
  id: string,
  firstName: string,
  lastName: string
  username: string
}

export type GroupDetails = {
  groupId: string,
  name: string,
  description: string,
  members: GroupMember[],
  creator: GroupMember,
  isDialog: boolean,
  lastMessage?: string
}


export default interface GroupService {

  findAll(
    onSuccess?: ResponseHandler<GroupDetails[]>,
    onFailure?: ResponseHandler<any>
  ) : void;

  createGroup(
    data: GroupCreationData,
    onSuccess?: ResponseHandler<string>,
    onFailure?: ResponseHandler<ConstraintViolation[]>
  ) : void;

  loadDetails(
    groupId: string,
    onSuccess: (details: GroupDetails) => void,
    onFailure: () => void
  ) : void;

  update(
    groupDetails: GroupDetails,
    onSuccess: ResponseHandler<any>,
    onFailure: ResponseHandler<ConstraintViolation[]>
  ) : void;


  addUser(
    groupId: string,
    username: string,
    onSuccess?: ResponseHandler<any>,
    onFailure?: ResponseHandler<any>
  ) : void;

  removeUser(
    groupId: string,
    username: string,
    onSuccess?: ResponseHandler<any>,
    onFailure?: ResponseHandler<any>
  ) : void;

  banUser(
    groupId: string,
    username: string,
    onSuccess?: ResponseHandler<any>,
    onFailure?: ResponseHandler<any>
  ) : void;

  kickUser(
    groupId: string,
    username: string,
    onSuccess?: ResponseHandler<any>,
    onFailure?: ResponseHandler<any>
  ) : void;
}
