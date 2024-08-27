import { useState, Dispatch, SetStateAction } from "react";
import { Heart } from "lucide-react";
import { Comment } from "@/types/Post";
import { formatTimestamp, likeContent } from "@/lib/utils";
import { mutate } from "swr";

const CommentItem = ({
  comment,
  setReplyToCommentId,
  setInputCommentText,
}: {
  comment: Comment;
  setReplyToCommentId: Dispatch<SetStateAction<string | null>>;
  setInputCommentText: Dispatch<SetStateAction<string>>;
}) => {
  const [showReplies, setShowReplies] = useState(false); // State to toggle replies visibility

  const likeComment = async () => {
    try {
      await likeContent("Comment", comment._id);
      mutate("/posts");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex mb-5  gap-10 justify-between items-center w-full">
        <div className="flex gap-2">
          <img
            src={`http://127.0.0.1:5000/${comment.author.profilePicture}`}
            className="w-7 h-7 rounded-full"
          />
          <div className="flex flex-col text-xs gap-1">
            <div className="flex gap-2">
              <strong>{comment.author.username}</strong>
              <span>{comment.text}</span>
            </div>
            <div className="flex gap-3 text-xs justify-between text-muted-foreground">
              <span>{formatTimestamp(comment.createdAt)}</span>
              <span>{comment.likes.length} likes</span>
              <span
                className="hover:underline cursor-pointer"
                onClick={() => {
                  setReplyToCommentId(comment._id);
                  setInputCommentText(`@${comment.author.username} `);
                }}
              >
                Reply
              </span>
              {comment.replies.length > 0 && (
                <span
                  className="hover:underline cursor-pointer"
                  onClick={() => setShowReplies((prev) => !prev)}
                >
                  {showReplies
                    ? "Hide Replies"
                    : `View Replies (${comment.replies.length})`}
                </span>
              )}
            </div>
          </div>
        </div>
        <span>
          <Heart
            onClick={likeComment}
            className="w-4 h-4 hover:fill-gray-400 hover:cursor-pointer hover:text-gray-400"
          />
        </span>
      </div>

      {/* Render replies below the comment only when showReplies is true */}
      {showReplies && (
        <div className="pl-8">
          {comment.replies.map((reply) => (
            <div key={reply._id} className="flex gap-2 mt-2">
              <img
                src={`http://127.0.0.1:5000/${reply.author.profilePicture}`}
                className="w-6 h-6 rounded-full"
              />
              <div>
                <div className="flex text-xs gap-2">
                  <strong>{reply.author.username}</strong>
                  <span>{reply.text}</span>
                </div>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>{formatTimestamp(reply.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default CommentItem;
