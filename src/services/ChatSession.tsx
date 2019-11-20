import {ResponseHandler} from "./types";

export interface Sender {
  id: number,
  username: string,
  firstName: string,
  lastName: string
}

export interface Message {
  id: number,
  content: string
  dateCreated: Date,
  sender: Sender
}

export interface Page<T> {
  size: number,
  next: number|null,
  previous: number|null,
  content: T[]
}

export default interface ChatSession {

  addListener(listener: ResponseHandler<Message[]>) : void

  loadMessagesPage(page: number, handler: ResponseHandler<Page<Message>>) : void;

  loadAllMessages(handler: ResponseHandler<Message[]>) : void;

  close() : void;

}