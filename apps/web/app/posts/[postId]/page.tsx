"use client";

import { useAuth } from "@/app/context/AuthContext";
import axiosInstance from "@/lib/axios";
import { fetcher, formatDate } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import PostCard from "./posts/PostCard";
import CommentsSection from "./CommentsSection";
import { Post } from "@/types/Post";
import { User } from "@/types/User";
export interface Comment {
  _id: string;
  postId: string;
  author: User;
  text: string;
  createdAt: string;
  updatedAt: string;
  likes: any[];
  replies: any[];
}
export type PostState = {
  commentText: string;
  postLike: boolean;
  postLikeCount: number;
  comments: Comment[];
};
const PostPage = ({ params }: { params: { postId: string } }) => {
  const { user } = useAuth();

  // Fetch post data using SWR
  const {
    data: post,
    isLoading,
    error,
    mutate,
  } = useSWR<Post>(`/posts/?postId=${params.postId}`, fetcher);

  const [postState, setPostState] = useState<PostState>({
    commentText: "",
    postLike: false,
    postLikeCount: 0,
    comments: [],
  });

  useEffect(() => {
    if (post && user) {
      setPostState({
        commentText: "",
        postLike: post.likes.includes(user._id),
        postLikeCount: post.likes.length,
        comments: post.comments,
      });
    }
  }, [post, user]);

  // Toggle like functionality
  const toggleLike = async () => {
    const likeState = !postState.postLike;
    const likeCount = likeState
      ? postState.postLikeCount + 1
      : postState.postLikeCount - 1;

    setPostState((prev) => ({
      ...prev,
      postLike: likeState,
      postLikeCount: likeCount,
    }));
    try {
      await axiosInstance.post(`/posts/${params.postId}/Post/like`);
      mutate();
    } catch (error) {
      console.error("Error liking post:", error);
      setPostState((prev) => ({
        ...prev,
        postLike: !likeState,
        postLikeCount: prev.postLikeCount - 1,
      }));
    }
  };

  // Share post functionality
  const sharePost = async () => {
    try {
      const response = await axiosInstance.post(
        `/posts/${params.postId}/share`
      );

      if (response.data) {
        mutate();

        if (navigator.share) {
          await navigator.share({
            title: post && post.content,
            url: `http://127.0.0.1:5000/posts/${params.postId}`,
          });
        } else {
          alert("Web Share API not supported");
        }
      }
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  // Add comment functionality
  const addComment = async () => {
    if (!postState.commentText) return;

    try {
      const response = await axiosInstance.post(
        `/posts/${params.postId}/comments`,
        { content: postState.commentText }
      );

      if (response.data) {
        mutate();
        setPostState((prev) => ({
          ...prev,
          commentText: "",
          comments: [...prev.comments, response.data],
        }));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  //TODO Add Skeleton
  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {JSON.stringify(error)}</h1>;

  return post && user ? (
    <div className="w-full sm:max-w-lg mx-auto">
      <PostCard
        post={post}
        postState={postState}
        toggleLike={toggleLike}
        sharePost={sharePost}
        setPostState={setPostState}
        addComment={addComment}
      />
      <CommentsSection comments={postState.comments} postID={post._id} />
    </div>
  ) : null;
};

export default PostPage;
