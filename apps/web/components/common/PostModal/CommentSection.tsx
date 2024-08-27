import { Dispatch, SetStateAction } from "react";
import CommentItem from "./CommentItem";
import CommentInputSection from "./CommentInputSection";
import { Post } from "@/types/Post";

const CommentsSection = ({
  post,
  inputCommentText,
  setInputCommentText,
  showEmojiPicker,
  setShowEmojiPicker,
  handleCommentSubmit,
  setReplyToCommentId,
  replyToCommentId,
}: {
  post: Post;
  inputCommentText: string;
  setInputCommentText: Dispatch<SetStateAction<string>>;
  showEmojiPicker: boolean;
  replyToCommentId: string | null;
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
  handleCommentSubmit: (e: { preventDefault: () => void }) => Promise<void>;
  setReplyToCommentId: Dispatch<SetStateAction<string | null>>;
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto flex-grow p-4">
        {post.comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            setReplyToCommentId={setReplyToCommentId}
            setInputCommentText={setInputCommentText}
          />
        ))}
      </div>

      <CommentInputSection
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

export default CommentsSection;
