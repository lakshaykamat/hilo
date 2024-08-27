import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import axiosInstance from "@/lib/axios";
import { Post } from "@/types/Post";
import PostContent from "./PostCardContent";
import PostCardFooter from "./PostCardFooter";
import PostCardHeader from "./PostCardHeader";
import { mutate } from "swr";
import PostModal from "./PostModal/PostModal";
import { likeContent } from "@/lib/utils";

type PostStateCard = {
  count: number;
  isLiked: boolean;
};

export const PostCard = ({ post }: { post: Post }) => {
  const { user } = useAuth();
  if (!user) return;
  const [postLike, setPostLike] = useState<PostStateCard>({
    count: post.likes.length,
    isLiked: user ? post.likes.some((like) => like._id === user._id) : false, // Check if the logged-in user has liked the post
  });
  const [inputCommentText, setInputCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPostModelOpen, setPostModelOpen] = useState(false);
  const isTexutalPost = !post.media.fileType && !post.media.fileType;

  const modalRef = useRef<HTMLDivElement>(null);

  const followUser = async () => {
    if (!user) return;
    try {
      await axiosInstance.post(`/users/follow/${post.author._id}`);
      mutate("/posts");
    } catch (error) {
      console.log(error);
    }
  };
  const toggleLike = async () => {
    if (!user) return;

    const updatedCount = postLike.isLiked
      ? Math.max(postLike.count - 1, 0)
      : postLike.count + 1;
    const updatedIsLiked = !postLike.isLiked;

    // Optimistic UI update
    setPostLike({ count: updatedCount, isLiked: updatedIsLiked });

    try {
      await likeContent("Post", post._id);
    } catch (error) {
      console.error("Error liking post:", error);

      // Revert the optimistic update in case of error
      setPostLike({ count: postLike.count, isLiked: postLike.isLiked });
    }
    mutate("/posts");
  };

  const addEmoji = (emoji: any) => {
    setInputCommentText((prev) => prev + emoji.native);
  };

  const closeModal = () => {
    setPostModelOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    const handleScroll = () => {
      closeModal();
    };

    if (isPostModelOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isPostModelOpen]);

  const postComment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!inputCommentText) return;

    try {
      const response = await axiosInstance.post(`/posts/${post._id}/comments`, {
        content: inputCommentText,
      });
      setInputCommentText("");
      mutate("/posts");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="w-full sm:w-[30rem] flex flex-col border-none">
      <PostCardHeader author={post.author} createdAt={post.createdAt} />
      <PostContent
        isTexutalPost={isTexutalPost}
        id={post._id}
        fileType={post.media.fileType}
        fileUrl={post.media.file}
        content={post.content}
        metadata={post.media.metadata}
      />
      <PostCardFooter
        postComment={postComment}
        isPostModelOpen={isPostModelOpen}
        setPostModelOpen={setPostModelOpen}
        isTexutalPost={isTexutalPost}
        inputCommentText={inputCommentText}
        setInputCommentText={setInputCommentText}
        username={post.author.username}
        content={post.content}
        likes={post.likes}
        toggleLike={toggleLike}
        postLikes={postLike.count}
        isLiked={postLike.isLiked}
        sharesCount={post.shares.length}
        commentsCount={post.comments.length}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        addEmoji={addEmoji}
        LoggedInUser={user}
        followUser={followUser}
      />
      {isPostModelOpen && (
        <PostModal
          followUser={followUser}
          postComment={postComment}
          inputCommentText={inputCommentText}
          setInputCommentText={setInputCommentText}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          ref={modalRef}
          post={post}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export const PostsPage = ({ posts }: { posts: Post[] }) => (
  <div className="flex mx-auto items-center flex-col mb-20 gap-6">
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  </div>
);

export default PostCard;
