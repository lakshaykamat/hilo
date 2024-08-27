import { Heart, MessageCircle, Bookmark, Smile, SendIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { User } from "@/types/User";

type PostCardFooterProps = {
  isTexutalPost: boolean;
  content: string;
  username: string;
  postLikes: number;
  LoggedInUser: User;
  isLiked: boolean;
  likes: User[];
  sharesCount: number;
  commentsCount: number;
  inputCommentText: string;
  setInputCommentText: Dispatch<SetStateAction<string>>;
  toggleLike: () => Promise<void>;
  showEmojiPicker: boolean;
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
  addEmoji: (emoji: any) => void;
  setPostModelOpen: Dispatch<SetStateAction<boolean>>;
  isPostModelOpen: boolean;
  followUser: () => Promise<void>;
  postComment: (e: { preventDefault: () => void }) => Promise<void>;
};

const PostCardFooter = (props: PostCardFooterProps) => (
  <div className="flex flex-col items-start justify-between">
    {/* Like, Comment, Share, Bookmark Icons */}
    <PostActions
      isLiked={props.isLiked}
      postLikes={props.postLikes}
      commentsCount={props.commentsCount}
      sharesCount={props.sharesCount}
      toggleLike={props.toggleLike}
      setPostModelOpen={props.setPostModelOpen}
    />

    {/* Display Like Count */}
    <LikeCount
      likes={props.likes}
      postLikes={props.postLikes}
      LoggedInUser={props.LoggedInUser}
      followUser={props.followUser}
    />

    {/* Display Post Content if not textual */}
    {!props.isTexutalPost && (
      <div className="flex gap-2">
        <span className="font-bold">{props.username}</span>
        <span>{props.content}</span>
      </div>
    )}

    {/* View All Comments */}
    {props.commentsCount > 0 && (
      <span className="text-muted-foreground">
        View all {props.commentsCount} comments
      </span>
    )}

    {/* Comment Input Section */}
    <CommentInput
      inputCommentText={props.inputCommentText}
      setInputCommentText={props.setInputCommentText}
      postComment={props.postComment}
      showEmojiPicker={props.showEmojiPicker}
      setShowEmojiPicker={props.setShowEmojiPicker}
      addEmoji={props.addEmoji}
    />
  </div>
);

const PostActions = ({
  isLiked,
  postLikes,
  commentsCount,
  sharesCount,
  toggleLike,
  setPostModelOpen,
}: {
  isLiked: boolean;
  postLikes: number;
  commentsCount: number;
  sharesCount: number;
  toggleLike: () => Promise<void>;
  setPostModelOpen: Dispatch<SetStateAction<boolean>>;
}) => (
  <div className="flex w-full justify-between items-center mb-2 gap-6">
    <div className="flex items-center gap-6">
      <ActionIcon
        icon={
          <Heart
            onClick={toggleLike}
            className={`cursor-pointer hover:text-gray-400 ${
              isLiked ? "fill-red-500 text-red-500" : ""
            }`}
          />
        }
        count={postLikes}
      />
      <ActionIcon
        icon={
          <MessageCircle
            onClick={() => setPostModelOpen(true)}
            className="cursor-pointer hover:text-gray-400"
          />
        }
        count={commentsCount}
      />
      <ActionIcon
        icon={<SendIcon className="cursor-pointer hover:text-gray-400" />}
        count={sharesCount}
      />
    </div>
    <Bookmark />
  </div>
);

const LikeCount = ({
  likes,
  postLikes,
  LoggedInUser,
  followUser,
}: {
  likes: User[];
  postLikes: number;
  LoggedInUser: User;
  followUser: () => Promise<void>;
}) => {
  return (
    <>
      {postLikes > 0 ? (
        <Dialog>
          <DialogTrigger>
            <span className="hover:cursor-pointer">{postLikes} likes</span>
          </DialogTrigger>
          <DialogContent className="p-0 pb-7">
            <DialogTitle className="text-center border-b py-4">
              Likes
            </DialogTitle>
            <DialogDescription className="hidden">Post Likes</DialogDescription>
            {likes.map((user) => (
              <UserLike
                key={user._id}
                user={user}
                LoggedInUser={LoggedInUser}
                followUser={followUser}
              />
            ))}
          </DialogContent>
        </Dialog>
      ) : (
        <span>{postLikes} likes</span>
      )}
    </>
  );
};

const UserLike = ({
  user,
  LoggedInUser,
  followUser,
}: {
  user: User;
  LoggedInUser: User;
  followUser: () => Promise<void>;
}) => {
  return (
    <div className="flex justify-between items-center px-4">
      <div className="flex gap-3 items-center">
        <img
          src={`http://127.0.0.1:5000/${user.profilePicture}`}
          className="w-14 h-14 rounded-full"
          alt={user.username}
        />
        <div>
          <p>@{user.username}</p>
          <p className="text-sm text-muted-foreground">{user.name}</p>
        </div>
      </div>
      {LoggedInUser._id !== user._id &&
        (user.followers?.some((fl) => fl._id === LoggedInUser._id) ? (
          <Button variant={"destructive"} onClick={followUser}>
            Unfollow
          </Button>
        ) : (
          <Button onClick={followUser}>Follow</Button>
        ))}
    </div>
  );
};

const CommentInput = ({
  inputCommentText,
  setInputCommentText,
  postComment,
  showEmojiPicker,
  setShowEmojiPicker,
  addEmoji,
}: {
  inputCommentText: string;
  setInputCommentText: Dispatch<SetStateAction<string>>;
  postComment: (e: { preventDefault: () => void }) => Promise<void>;
  showEmojiPicker: boolean;
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
  addEmoji: (emoji: any) => void;
}) => (
  <div className="flex items-center gap-3 w-full border-b relative">
    <input
      value={inputCommentText}
      name="comment"
      onChange={(e) => setInputCommentText(e.target.value)}
      className="bg-inherit border-none outline-none w-full py-2"
      placeholder="Add Comment..."
    />
    {inputCommentText && (
      <Button onClick={postComment} size={"sm"}>
        Post
      </Button>
    )}
    <Smile
      className="w-4 h-4 cursor-pointer"
      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
    />
    {showEmojiPicker && (
      <div className="absolute bottom-10 right-0 z-10">
        <Picker
          theme="light"
          data={data}
          onClickOutside={() => setShowEmojiPicker(false)}
          onEmojiSelect={(emoji: any) => addEmoji(emoji)}
        />
      </div>
    )}
  </div>
);

const ActionIcon = ({
  icon,
  count,
}: {
  icon: React.ReactNode;
  count: number;
}) => (
  <div className="flex items-center gap-1">
    {icon}
    {/* {count > 0 && <span clasName="text-sm font-medium">{count}</span>} */}
  </div>
);

export default PostCardFooter;
