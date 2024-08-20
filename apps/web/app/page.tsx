"use client";
import PostCard, { PostsPage } from "@/components/common/PostCard";
import { fetcher } from "@/lib/utils";
import { Post } from "@/types/Post";
import Error from "next/error";
import React from "react";
import useSWR from "swr";

const HomePage = () => {
  const {
    data: posts,
    isLoading,
    error,
    mutate,
  } = useSWR<Post[]>("/posts", fetcher); //* Fetches all post
  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <Error statusCode={500} />;
  return (
    <>
      {/* <h1 className="text-2xl sm:text-4xl font-bold mb-7">Home</h1> */}
      <div className="flex mx-auto items-center flex-col mb-20 gap-6">
        {posts &&
          posts.map((post: Post) => <PostCard key={post._id} post={post} />)}
      </div>
    </>
  );
};
//TODO Create Skeletons
export default HomePage;
