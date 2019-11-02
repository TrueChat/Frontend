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
  name: string
}

export type GroupDetails = {
  groupId: string,
  name: string,
  description: string,
  members: GroupMember[]
}

export type GroupCreationSuccessHandler = () => void;
export type GroupCreationFailureHandler = () => void;

export default interface GroupService {

  createGroup(
    data: GroupCreationData,
    onSuccess?: GroupCreationSuccessHandler,
    onFailure?: GroupCreationFailureHandler
  ) : void;

  loadDetails(
    groupId: string,
    onSuccess: (details: GroupDetails) => void,
    onFailure: () => void
  ) : void;

  update(
    groupDetails: GroupDetails,
    onSuccess: () => void,
    onFailure: () => void
  ) : void;

  addUser(
    groupId: string,
    username: string,
    onSuccess?: () => void,
    onFailure?: () => void
  ) : void;

  removeUser(
    groupId: string,
    username: string,
    onSuccess?: () => void,
    onFailure?: () => void
  ) : void
}
