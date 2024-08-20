"use client";
import { fetcher } from "@/lib/utils";
import React from "react";
import useSWR from "swr";
import { useAuth } from "../context/AuthContext";
import ProfileComponent from "./ProfileComponent";
import { User } from "@/types/User";
import { Post } from "@/types/Post";
import Error from "../error";
type UserWithPosts = User & {
  posts: Post[];
};
const ProfilePage = () => {
  const { user } = useAuth();

  const {
    data: userData,
    isLoading,
    error,
  } = useSWR<UserWithPosts>(`/users?username=${user.username}`, fetcher); //* Fetches users deatils by userID
  //TODO Add SKeleton

  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <Error />;

  if (userData) {
    return (
      <>
        <h1 className="text-2xl sm:text-4xl font-bold mb-7">Profile</h1>
        <ProfileComponent user={userData} />
      </>
    );
  }
};

export default ProfilePage;
