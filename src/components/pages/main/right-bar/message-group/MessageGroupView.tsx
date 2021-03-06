import React from "react";
import {Message, Sender} from "../../../../../services/ChatSession";
import {Dropdown, UserInitialsAvatar} from "../../../../widgets/Widgets";
import ModalLink from "../../modals/ModalLink";
import "./MessageGroupView.scss";

export type MessageGroup = {
  messages: Message[],
  sender: Sender,
  date: Date
}


export default class MessageGroupView extends React.Component<Props> {

  render() {
    const { messageGroup, currentUser } = this.props;
    return (
      <div className="Message-group-view">
        <div className="row">
          <div className="col-1">
            <UserInitialsAvatar profile={{
              first_name: messageGroup.sender.firstName,
              last_name: messageGroup.sender.lastName,
              username: messageGroup.sender.username,
              images: messageGroup.sender.images,
              about: ""
            }}/>
          </div>
          <div className="col-11">
            <div className="row">
              <div className="col-10 message-sender">
                <ModalLink
                  modalName="userProfile"
                  relativePath={`${messageGroup.sender.username}`}
                  className="a-none"
                >
                  {this.displaySenderName(messageGroup.sender)}
                </ModalLink>
              </div>
              <div className="col-2 text-right">
                {this.formatMessageTime(messageGroup.date)}
              </div>
            </div>
            <div className="message-contents">
              {messageGroup.messages.map(message => (
                <div key={`message-${message.id}`} className="row mt-1 message">
                  <div className="col-10">
                    {message.images.map((image, i) => (
                      <div key={i} className="mt-2 mb-2">
                        <img src={image.imageURL} width="75%"/>
                      </div>
                    ))}
                    <div className="text-break">
                      {message.content}
                    </div>
                  </div>
                  <div className="col-2 text-right message-dropdown">
                    {currentUser === message.sender.username
                      ? <this.MessageActionsDropdown key={`message-${message.id}-actions`} message={message}/>
                      : null
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  formatMessageTime = (date: Date) => {
    let hours = "";
    let minutes = "";
    if (date.getHours() < 10) {
      hours = `0${date.getHours()}`
    } else {
      hours = `${date.getHours()}`
    }

    if (date.getMinutes() < 10) {
      minutes = `0${date.getMinutes()}`;
    } else {
      minutes = `${date.getMinutes()}`
    }

    return `${hours}:${minutes}`

  };

  MessageActionsDropdown = ({message}: {message: Message}) => {
    return (
      <Dropdown
        toggle={<i className="fas fa-ellipsis-h message-actions"/>}
        options={["Edit", "Remove"]}
        onSelect={action => this.props.onActionSelected(action, message)}
      />
    );
  };

  displaySenderName(sender: Sender) : string {
    if (sender.firstName) {
      if (sender.lastName) {
        return `${sender.firstName} ${sender.lastName}`;
      }
      return sender.firstName;
    }
    return sender.username;
  };

}

type Props = {
  messageGroup: MessageGroup,
  onActionSelected: (action: string, message: Message) => void,
  currentUser: string
}

export function mergeMessages(messages: Message[]) {
  const groups: MessageGroup[] = [];

  if (messages.length === 0) {
    return groups;
  }

  groups.push(messageGroup(messages[0]));

  for (let i = 1; i < messages.length; i++) {
    let currentGroup = groups[groups.length - 1];
    let currentMessage = messages[i];

    if (canMerge(currentGroup, currentMessage)) {
      currentGroup.messages.push(currentMessage);
    } else {
      groups.push(messageGroup(currentMessage));
    }
  }

  return groups;
}

function canMerge(group: MessageGroup, lastMessage: Message): boolean {
  if (group.sender.id !== lastMessage.sender.id) {
    return false;
  }
  if (group.messages.length === 3) {
    return false;
  }

  const firstMessage = group.messages[0];
  const acceptableTimeDifference = 60 * 1000;
  const difference = lastMessage.dateCreated.getTime() - firstMessage.dateCreated.getTime();

  return difference <= acceptableTimeDifference;
}

function messageGroup(firstMessage: Message) : MessageGroup {
  return {
    messages: [firstMessage],
    date: firstMessage.dateCreated,
    sender: firstMessage.sender
  };
}