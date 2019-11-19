import ChatService from "../../../../../services/ChatService";
import React from "react";
import ChatSession, {Message} from "../../../../../services/ChatSession";
import GroupService from "../../../../../services/GroupService";
import Header from "./header/Header";
import "./ChatView.scss"

export default class ChatView extends React.Component<Props, State> {

  chatSession?: ChatSession;

  state = {
    messages: ([] as Message[])
  };

  componentDidMount(): void {
    this.chatSession = this.props.chatService.connect(this.props.chatId);
    this.chatSession.addListener(response => {
      this.setState(state => ({
        ...state, messages: [...state.messages, ...response.data]
      }))
    });
  }

  componentWillUnmount(): void {
    if (this.chatSession) {
      this.chatSession.close();
    }
  }

  render() {
    return (
      <div className="Chat-view">
        <Header groupService={this.props.groupService} groupId={this.props.chatId}/>
      </div>
    );
  }

}

type Props = {
  chatService: ChatService,
  groupService: GroupService,
  chatId: string
}

type State = {
  messages: Message[]
}