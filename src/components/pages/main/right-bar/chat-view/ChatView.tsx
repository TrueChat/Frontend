import ChatService from "../../../../../services/ChatService";
import React from "react";
import ChatSession, {Message, Sender} from "../../../../../services/ChatSession";
import GroupService from "../../../../../services/GroupService";
import Header from "./header/Header";
import "./ChatView.scss"
import {UserInitialsAvatar} from "../../../../widgets/Widgets";
import ModalLink from "../../modals/ModalLink";

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
      }));
    });
    this.chatSession.loadAllMessages(response => {
      this.setState(state => ({
        ...state, messages: [...state.messages, ...response.data]
      }))
    })
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
        <div className="body">
          <div className="messages">
            {this.state.messages.map(message => {
              return (
                <this.MessageView message={message}/>
              )
            })}
          </div>
        </div>
        <div className="message-input-container">
        </div>
      </div>
    );
  }

  MessageView = ({message}: { message: Message }) => {
    return (
      <div className="Message-view">
        <div className="row">
          <div className="col-2">
            <UserInitialsAvatar profile={{
              first_name: message.sender.username,
              last_name: message.sender.lastName,
              username: message.sender.firstName,
              about: ""
            }}/>
          </div>
          <div className="col-9">
            <div className="message-sender">
              <ModalLink
                modalName="userProfile"
                relativePath={`${message.sender.id}`}
                className="a-none"
              >
                {this.displaySenderName(message.sender)}
              </ModalLink>
            </div>
            <div className="message-contents">
              {message.content}
            </div>
          </div>
          <div className="col-1">
            {`${message.dateCreated.getHours()}:${message.dateCreated.getMinutes()}`}
          </div>
        </div>
      </div>
    );
  };

  displaySenderName = (sender: Sender) => {
    if (sender.firstName) {
      if (sender.lastName) {
        return `${sender.firstName} ${sender.lastName}`;
      }
      return sender.firstName;
    }
    return sender.username;
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