import { Dispatch, SetStateAction } from "react";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const CommentInputSection = ({
  inputCommentText,
  setInputCommentText,
  showEmojiPicker,
  setShowEmojiPicker,
  handleCommentSubmit,
  replyToCommentId,
  setReplyToCommentId,
}: {
  inputCommentText: string;
  setInputCommentText: Dispatch<SetStateAction<string>>;
  showEmojiPicker: boolean;
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
  handleCommentSubmit: (e: { preventDefault: () => void }) => Promise<void>;
  replyToCommentId: string | null;
  setReplyToCommentId: Dispatch<SetStateAction<string | null>>;
}) => {
  console.log(replyToCommentId);
  return (
    <div className="px-4 py-2 items-center border-t flex gap-2 w-full relative">
      <Smile
        className="w-7 h-7 cursor-pointer"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      />
      {showEmojiPicker && (
        <div className="absolute bottom-12 left-0 z-20">
          <Picker
            data={data}
            onEmojiSelect={(e: any) =>
              setInputCommentText(inputCommentText + e.native)
            }
          />
        </div>
      )}
      <form
        onSubmit={handleCommentSubmit}
        className="flex w-full items-center justify-between"
      >
        <input
          type="text"
          placeholder={
            replyToCommentId ? "Replying to comment..." : "Add a comment..."
          }
          value={inputCommentText}
          onChange={(e) => setInputCommentText(e.target.value)}
          className="bg-inherit outline-none text-sm w-full"
        />
        <div className="flex gap-2">
          {replyToCommentId && (
            <button
              className="text-xs font-medium bg-destructive rounded text-destructive-foreground px-2 cursor-pointer"
              onClick={() => {
                setReplyToCommentId(null);
                setInputCommentText("");
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className={`${
              inputCommentText ? "text-blue-500" : "text-blue-300"
            } text-sm font-medium`}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentInputSection;
