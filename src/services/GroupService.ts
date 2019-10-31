export type GroupCreationData = {
  name: string,
  description: string
}

export type GroupData = {
  name: string,
  description: string
}

export type GroupCreationSuccessHandler = () => void;
export type GroupCreationFailureHandler = () => void;

export default interface GroupService {

  createGroup(
    data: GroupCreationData,
    onSuccess?: GroupCreationSuccessHandler,
    onFailure?: GroupCreationFailureHandler
  ): void;
}
