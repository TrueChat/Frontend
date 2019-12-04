import {ResponseHandler} from "./types";
import {Image} from "./UserService";

export interface Sender {
  id: number,
  username: string,
  firstName: string,
  lastName: string,
  images: Image[]
}

export interface Message {
  id: number,
  content: string
  dateCreated: Date,
  sender: Sender,
  images: Image[]
}

export interface Page<T> {
  size: number,
  next: number|null,
  previous: number|null,
  content: T[]
}

export type ChatEventListener = (messages: Message[]) => void;


export default interface ChatSession {

  addMessagesDeletionListener(listener: ChatEventListener) : void;

  addMessagesAddingListener(listener: ChatEventListener) : void;

  addMessagesEditingListener(listener: ChatEventListener) : void;

  loadAllMessages(handler: ResponseHandler<Message[]>) : void;

  close() : void;

  editMessage(message: Message) : void;

  sendMessage(message: string, onSuccess: (message: Message) => void) : void;

  sendMessageWithAttachment(message: string, attachment: File, onSuccess: (message: Message) => void) : void;

  deleteMessage(message: Message, onSuccess: () => void) : void;
}