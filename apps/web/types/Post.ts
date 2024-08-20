import { User } from "./User";

export interface Post {
  _id: string;
  content: string;
  author: User;
  media: Media;
  createdAt: string;
  updatedAt: string;
  likes: User[];
  shares: string[];
  comments: Comment[];
}
export type Reply = {
  _id: string;
  commentId: string;
  author: User;
  text: string;
  createdAt: string;
  updatedAt: string;
};
export type Comment = {
  _id: string;
  postId: string;
  author: User;
  text: string;
  likes: string[];
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
};
export interface Media {
  file?: string;
  fileType?: string;
  metadata?: Metadata;
}

export interface Metadata {
  width: number;
  height: number;
  duration: string;
}
