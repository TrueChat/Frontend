import {ResponseHandler} from "./types";

export default interface PrivateChatService {

  exists(username: string, responseHandler: ResponseHandler<string|undefined>) : void;

  createChat(username: string, responseHandler: ResponseHandler<string>) : void;

}