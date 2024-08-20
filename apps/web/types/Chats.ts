import { User } from "./User";

export type Message = {
  _id: string;
  conversationId: string;
  sender: User;
  text: string;
  media: string;
  status: string;
  isDeleted: string;
  createdAt: string;
  updatedAt: string;
};
export type Conversation = {
  _id: string;
  participants: User[];
  lastMessage: any;
  isGroupChat: boolean;
  groupName: string;
  groupPicture: string;
  createdAt: string;
  updatedAt: string;
};
