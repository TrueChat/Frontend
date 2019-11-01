import React from "react";
import {UserProfile} from "../services/UserService";
import {GroupData} from "../services/GroupService";
import {ClipLoader} from "react-spinners";

export const Initials = ({initials} : {initials: string}) => (
  <span className="Initials-avatar">
    <span className="initials">{initials}</span>
  </span>
);

export const UserInitialsAvatar = ({profile}: {profile: UserProfile}) => (
  <Initials initials={
    profile.first_name && profile.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`
      : "NS"
  }/>
);

export const GroupInitialsAvatar = ({groupData} : {groupData: GroupData}) => (
  <Initials initials={
    groupData.name.length < 2
      ? "GN"
      : groupData.name.substr(0, 2)
  }/>
);

export const Spinner = () => (
  <ClipLoader color="rgb(153, 153, 153)"/>
);