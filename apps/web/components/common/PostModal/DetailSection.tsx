import { Dispatch, SetStateAction } from "react";
import CommentsSection from "./CommentSection";
import { Button } from "@/components/ui/button";
import { Post } from "@/types/Post";

const DetailsSection = ({
  post,
  user,
  inputCommentText,
  setInputCommentText,
  showEmojiPicker,
  setShowEmojiPicker,
  handleCommentSubmit,
  followUser,
  setReplyToCommentId,
  replyToCommentId,
}: {
  post: Post;
  user: any;
  replyToCommentId: string | null;
  inputCommentText: string;
  setInputCommentText: Dispatch<SetStateAction<string>>;
  showEmojiPicker: boolean;
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
  handleCommentSubmit: (e: { preventDefault: () => void }) => Promise<void>;
  followUser: () => Promise<void>;
  setReplyToCommentId: Dispatch<SetStateAction<string | null>>;
}) => {
  return (
    <div className="flex flex-col justify-between w-full">
      <div className="p-4 border-b flex gap-2 items-center">
        <img
          src={`http://127.0.0.1:5000/${post.author.profilePicture}`}
          className="w-7 rounded-full h-7"
        />
        <h1 className="font-medium text-sm">{post.author.username}</h1>
        {user && user._id !== post.author._id && (
          <>
            <span>•</span>
            {post.author.followers?.some((fl) => fl._id === user._id) ? (
              <Button variant={"destructive"} onClick={followUser} size={"sm"}>
                Unfollow
              </Button>
            ) : (
              <Button onClick={followUser} size={"sm"}>
                Follow
              </Button>
            )}
          </>
        )}
      </div>

      <CommentsSection
        post={post}
        inputCommentText={inputCommentText}
        setInputCommentText={setInputCommentText}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        handleCommentSubmit={handleCommentSubmit}
        replyToCommentId={replyToCommentId}
        setReplyToCommentId={setReplyToCommentId}
      />
    </div>
  );
};

export default DetailsSection;
