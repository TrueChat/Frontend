import PrivateChatService from "../PrivateChatService";
import {ResponseHandler} from "../types";

export default class MockPrivateChatService implements PrivateChatService {

  createChat(username: string, responseHandler: ResponseHandler<string>): void {
    responseHandler({
      status: 201,
      headers: { },
      data: "123"
    });
  }

  exists(username: string, responseHandler: ResponseHandler<string>): void {
    responseHandler({
      status: 200,
      headers: {},
      data: "123"
    });
  }



}