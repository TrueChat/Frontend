import ChatService from "../ChatService";
import ChatSession, {Message, Page, Sender} from "../ChatSession";
import {ResponseHandler} from "../types";

class MockChatSession implements ChatSession {

  private lastId: number = 0;
  private listeners: ResponseHandler<Message[]>[] = [];
  private interval: number = 300;
  private intervalId: any;
  private messages: Message[];

  constructor(interval?: number) {
    if (interval) {
      this.interval = interval;
    }

    this.intervalId = setInterval(() => {
      const messages: Message[] = [];
      for (let i = 1; i < 30; i++) {
        messages.push(this.mockMessage(this.lastId++, 1 % 5, this.time(20, i)),
        )
      }
      this.listeners.forEach(listener => {
        listener({
          status: 200, headers: { },
          data: messages
        })
      });
    }, this.interval);

    this.messages = [
      this.mockMessage(this.lastId++, 1, this.time(20, 40)),
      this.mockMessage(this.lastId++, 1, this.time(20, 40)),
      this.mockMessage(this.lastId++, 1, this.time(20, 45)),
      this.mockMessage(this.lastId++, 1, this.time(20, 45)),
      this.mockMessage(this.lastId++, 2, this.time(20, 55))
    ]
  }

  close(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  time(hour: number, minute: number) : Date {
    return new Date(2019, 11, 12, hour, minute);
  }

  mockMessage(number?: number, senderId?: number, date?: Date, content?: string) : Message {
    return {
      id: number ? number : 0,
      sender: {
        firstName: "User",
        lastName: "Mock",
        id: senderId ? senderId : 0,
        username: "mock_user"
      },
      content: content ? content : "mock long chat message",
      dateCreated: date ? date : new Date()
    }
  }

  loadAllMessages(handler: ResponseHandler<Message[]>) : void {
    handler({
      status: 200, headers: { },
      data: this.messages
    })
  }

  editMessage(message: Message): void {

  }

  sendMessage(messageContent: string, onSuccess: (message: Message) => void): void {
    console.log(messageContent);
    const message = this.mockMessage(this.lastId++, 1, this.time(20, 55), messageContent);
    this.messages.push(message);
    onSuccess(message);
  }

  deleteMessage(message: Message): void {
  }

  addMessagesAddingListener(listener: (messages: Message[]) => void): void {

  }

  addMessagesDeletionListener(listener: (messages: Message[]) => void): void {

  }

  addMessagesEditingListener(listener: (messages: Message[]) => void): void {

  }

}

export default class MockChatService implements ChatService {

  constructor(private interval: number) {
  }

  connect(chatId: string): ChatSession {
    return new MockChatSession(this.interval);
  }

}