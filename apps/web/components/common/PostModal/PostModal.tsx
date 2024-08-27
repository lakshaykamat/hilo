import { useState, RefObject, Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import MediaSection from "./MediaSection";
import DetailsSection from "./DetailSection";
import { useAuth } from "@/app/context/AuthContext";
import { Post } from "@/types/Post";
import axiosInstance from "@/lib/axios";
import { mutate } from "swr";
import { postReply } from "@/lib/utils";

const PostModel = ({
  post,
  closeModal,
  ref,
  inputCommentText,
  setInputCommentText,
  showEmojiPicker,
  setShowEmojiPicker,
  postComment,
  followUser,
}: {
  post: Post;
  closeModal: () => void;
  ref: RefObject<HTMLDivElement>;
  inputCommentText: string;
  setInputCommentText: Dispatch<SetStateAction<string>>;
  showEmojiPicker: boolean;
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
  postComment: (e: { preventDefault: () => void }) => Promise<void>;
  followUser: () => Promise<void>;
}) => {
  const { user } = useAuth();
  const { media, content } = post;
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);

  const handleCommentSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (replyToCommentId) {
      console.log(replyToCommentId);
      await postReply(replyToCommentId, inputCommentText);
    } else {
      await postComment(e);
    }
    mutate("/posts");
    setInputCommentText("");
    setReplyToCommentId(null);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
      <button
        className="absolute top-5 right-5 text-white hover:outline outline-1 transition-all duration-700 p-2 rounded-lg"
        onClick={closeModal}
      >
        <X className="w-7 h-7" />
      </button>
      <div
        ref={ref}
        className="bg-white dark:bg-inherit border relative rounded-lg shadow-lg w-full max-w-7xl min-h-[45rem] mx-auto flex"
      >
        <div className="flex w-full">
          <MediaSection
            isImagePost={media?.fileType?.includes("image") || false}
            isVideoPost={media?.fileType?.includes("video") || false}
            isTextPost={!media?.fileType && true}
            post={post}
          />
          <DetailsSection
            post={post}
            user={user}
            inputCommentText={inputCommentText}
            setInputCommentText={setInputCommentText}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            handleCommentSubmit={handleCommentSubmit}
            followUser={followUser}
            setReplyToCommentId={setReplyToCommentId}
            replyToCommentId={replyToCommentId}
          />
        </div>
      </div>
    </div>
  );
};

export default PostModel;
