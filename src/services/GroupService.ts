import {ConstraintViolation, ResponseHandler} from "./types";
import {Image} from "./UserService";

export type GroupCreationData = {
  name: string,
  description: string
}

export type GroupData = {
  name: string,
  description: string,
  images: Image[]
}

export type GroupMember = {
  id: string,
  firstName: string,
  lastName: string
  username: string,
  images: Image[],
}

export type GroupDetails = {
  groupId: string,
  name: string,
  description: string,
  members: GroupMember[],
  creator: GroupMember,
  isDialog: boolean,
  lastMessage?: string,
  images: Image[]
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

  leaveGroup(groupId: string, onSuccess: ResponseHandler<any>) : void;

  uploadImage(
    groupId: string,
    image: File,
    onSuccess: ResponseHandler<any>,
    onFailure: ResponseHandler<any>
  ) : void;
}
