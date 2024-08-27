"use client";
import PostCard from "@/components/common/PostCard";
import { fetcher } from "@/lib/utils";
import { Post } from "@/types/Post";
import React from "react";

import useSWR from "swr";

type Props = {};

const SavedPostPage = (props: Props) => {
  return (
    <div className="bg-secondary p-10 rounded-lg">
      <h1 className="text-xl font-bold">Coming Soon...</h1>
      <p>Thank you for your patience!</p>
    </div>
  );
};
export default SavedPostPage;
