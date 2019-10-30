import Any = jasmine.Any;

export type GroupCreationData = {
  name: string,
  description: string
}

export default interface GroupService {
  createGroup: (data: GroupCreationData) => Promise<Any> // Any because subsequent behaviour will be defined later
}