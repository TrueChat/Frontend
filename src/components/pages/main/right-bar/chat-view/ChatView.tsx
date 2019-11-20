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
            {this.mergeMessages(this.state.messages).map(messageGroup => {
              return (
                <this.MessageView
                  key={`Message-group-${messageGroup.messages[0].id}`}
                  messageGroup={messageGroup}
                />
              )
            })}
          </div>
        </div>
        <div className="message-input-container">
        </div>
      </div>
    );
  }

  MessageView = ({messageGroup}: { messageGroup: MessageGroup }) => {
    return (
      <div className="Message-group-view">
        <div className="row">
          <div className="col-1">
            <UserInitialsAvatar profile={{
              first_name: messageGroup.sender.username,
              last_name: messageGroup.sender.lastName,
              username: messageGroup.sender.firstName,
              about: ""
            }}/>
          </div>
          <div className="col-11">
            <div className="row">
              <div className="col-10 message-sender">
                <ModalLink
                  modalName="userProfile"
                  relativePath={`${messageGroup.sender.id}`}
                  className="a-none"
                >
                  {this.displaySenderName(messageGroup.sender)}
                </ModalLink>
              </div>
              <div className="col-2 text-right">
                {`${messageGroup.date.getHours()}:${messageGroup.date.getMinutes()}`}
              </div>
            </div>
            <div className="message-contents">
              {messageGroup.messages.map(message => (
                <div key={`message-${message.id}`}>
                  <div className="row mt-1">
                    <div className="col-10">
                      {message.content}
                    </div>
                    <div className="col-2 text-right">

                    </div>
                  </div>
                </div>
              ))}
            </div>
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
  };

  mergeMessages = (messages: Message[]) => {
    const groups: MessageGroup[] = [];

    if (messages.length === 0) {
      return groups;
    }

    groups.push(this.messageGroup(messages[0]));

    for (let i = 1; i < messages.length; i++) {
      let currentGroup = groups[groups.length - 1];
      let currentMessage = messages[i];

      if (this.canMerge(currentGroup, currentMessage)) {
        currentGroup.messages.push(currentMessage);
      } else {
        groups.push(this.messageGroup(currentMessage));
      }
    }

    return groups;
  };

  canMerge(group: MessageGroup, lastMessage: Message): boolean {
    if (group.sender.id !== lastMessage.sender.id) {
      return false;
    }

    const firstMessage = group.messages[0];
    const acceptableTimeDifference = 60 * 1000;
    const difference = lastMessage.dateCreated.getTime() - firstMessage.dateCreated.getTime();

    console.log(difference);
    return difference <= acceptableTimeDifference;
  }

  messageGroup(firstMessage: Message) : MessageGroup {
    return {
      messages: [firstMessage],
      date: firstMessage.dateCreated,
      sender: firstMessage.sender
    };
  }

}

type MessageGroup = {
  messages: Message[],
  sender: Sender,
  date: Date
}

type Props = {
  chatService: ChatService,
  groupService: GroupService,
  chatId: string
}

type State = {
  messages: Message[]
}