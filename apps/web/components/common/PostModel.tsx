import { Post } from "@/types/Post";
import {
  X,
  Smile,
  Heart,
  HeartIcon,
  MessageCircle,
  Send,
  BookmarkCheck,
  Bookmark,
} from "lucide-react";
import { RefObject, Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useAuth } from "@/app/context/AuthContext";
import { formatDate } from "@/lib/utils";
import { User } from "@/types/User";

const PostModel = (props: {
  post: Post;
  closeModal: () => void;
  ref: RefObject<HTMLDivElement>;
  inputCommentText: string;
  setInputCommentText: Dispatch<SetStateAction<string>>;
  showEmojiPicker: boolean;
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
  postComment: () => Promise<void>;
  followUser: () => Promise<void>;
}) => {
  const { user } = useAuth();
  const { media, content } = props.post;

  // Determines if post has an image, video, or is textual
  const isImagePost = media?.fileType?.includes("image");
  const isVideoPost = media?.fileType?.includes("video");
  const isTextPost = !media?.fileType && content;
  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
        <button
          className="absolute top-5 right-5 text-white hover:outline outline-1 transition-all duration-700 p-2 rounded-lg"
          onClick={props.closeModal}
        >
          <X className="w-7 h-7" />
        </button>
        <div
          ref={props.ref}
          className="bg-white dark:bg-inherit border relative rounded-lg shadow-lg w-full max-w-7xl min-h-[45rem] mx-auto flex"
        >
          <div className="flex w-full">
            {/* Media Section */}
            <div className="w-full border-r flex items-center justify-center">
              {isImagePost && (
                <img
                  className="object-contain max-h-[90vh] w-full"
                  src={`http://127.0.0.1:5000/${media.file}`}
                  alt={`${props.post.author.username}'s post media`}
                />
              )}

              {isVideoPost && (
                <div className="relative w-full h-0 pb-[56.25%]">
                  {/* 16:9 aspect ratio (56.25%) */}
                  <video
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata" // Preload only metadata for faster initial loading
                    poster="https://github.com/lakshaykamat.png" // Set poster image
                    src={`http://127.0.0.1:5000/${media.file}`}
                  >
                    <source
                      src={`http://127.0.0.1:5000/${media.file}`}
                      type={media.fileType}
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {isTextPost && (
                <div className="text- p-8 text-xl max-h-[90vh] w-full">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: content.replace(/\n/g, "<br>"),
                    }}
                  ></p>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-between w-full">
              <div className="p-4 border-b flex gap-2 items-center">
                <img
                  src={`http://127.0.0.1:5000/${props.post.author.profilePicture}`}
                  className="w-7 rounded-full h-7"
                />
                <h1 className="font-medium text-sm">
                  {props.post.author.username}
                </h1>
                {user && user._id != props.post.author._id && (
                  <>
                    <span>•</span>
                    {props.post.author.followers &&
                    props.post.author.followers.some(
                      (fl) => fl._id == user._id
                    ) ? (
                      <Button
                        variant={"destructive"}
                        onClick={props.followUser}
                        size={"sm"}
                      >
                        Unfollow
                      </Button>
                    ) : (
                      <Button onClick={props.followUser} size={"sm"}>
                        Follow
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Comments Section */}
              <div className="flex flex-grow flex-col overflow-y-auto p-4">
                {!isTextPost && (
                  <span className="text-sm flex gap-2 mb-3 items-center">
                    <div className="flex gap-2 items-center">
                      <img
                        src={`http://127.0.0.1:5000/${props.post.author.profilePicture}`}
                        className="w-7 h-7 rounded-full"
                      />
                      <strong>{props.post.author.username}</strong>
                    </div>
                    <span>{props.post.content}</span>
                  </span>
                )}
                {/* TODO Show replies */}
                {props.post.comments.length > 0 &&
                  props.post.comments.map((comment) => (
                    <span
                      key={comment._id}
                      className="text-sm flex gap-2 mb-3 items-center"
                    >
                      <div className="flex gap-2 items-center">
                        <img
                          src={`http://127.0.0.1:5000/${comment.author.profilePicture}`}
                          className="w-7 h-7 rounded-full"
                        />
                        <strong>{comment.author.username}</strong>
                      </div>
                      <span>{comment.text}</span>
                    </span>
                  ))}
              </div>

              <div className="border gap-4 flex flex-col px-4 py-4">
                <div className="flex justify-between ">
                  <div className="flex gap-5">
                    {/* TODO Make this action button works */}
                    <HeartIcon className="w-7 h-7" />
                    <MessageCircle className="w-7 h-7" />
                    <Send className="w-7 h-7" />
                  </div>
                  <Bookmark className="w-7 h-7" />
                </div>
                <div>
                  {/* TODO Show likes when clicked */}
                  <p className="hover:cursor-pointer hover:underline">
                    {props.post.likes.length} Likes
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(props.post.createdAt)}
                  </p>
                </div>
              </div>
              {/* Comment Input Section */}
              <div className="px-4 py-2 items-center border-t flex gap-2 w-full relative">
                <Smile
                  className="w-7 h-7 cursor-pointer"
                  onClick={() =>
                    props.setShowEmojiPicker(!props.showEmojiPicker)
                  }
                />
                {props.showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 z-10">
                    <Picker
                      data={data}
                      onClickOutside={() => props.setShowEmojiPicker(false)}
                      onEmojiSelect={(emoji: any) =>
                        props.setInputCommentText((prev) => prev + emoji.native)
                      }
                    />
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={props.inputCommentText}
                  onChange={(e) => props.setInputCommentText(e.target.value)}
                  className="w-full bg-inherit outline-none text-sm px-2 h-full"
                />
                {/* <Button variant={"outline"}>Post</Button> */}
                <button
                  onClick={props.postComment}
                  className={`${
                    props.inputCommentText ? "text-blue-500" : "text-blue-300"
                  } text-sm font-medium`}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostModel;
