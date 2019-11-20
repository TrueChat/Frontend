import ChatSession from "./ChatSession";

export default interface ChatService {

  connect(chatId: string) : ChatSession

}