"use client";
import { fetcher } from "@/lib/utils";
import React, { useEffect } from "react";
import useSWR from "swr";
import ProfileComponent from "../ProfileComponent";
import axiosInstance from "@/lib/axios";
import { User } from "@/types/User";
import { Post } from "@/types/Post";
import Error from "@/app/error";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

type UserWithPosts = User & {
  posts: Post[];
};
const ProfilePageOfUser = ({ params }: { params: { username: string } }) => {
  const { user: loggedInUser } = useAuth();
  const router = useRouter();
  const {
    data: user,
    isLoading,
    error,
    mutate,
  } = useSWR<UserWithPosts>(`/users?username=${params.username}`, fetcher); //* Fetches user details by userID

  useEffect(() => {
    if (loggedInUser) {
      if (params.username === loggedInUser.username) {
        router.push("/profile");
      }
    }
  }, [user]);
  const followUser = async () => {
    if (!user) return;
    try {
      await axiosInstance.post(`/users/follow/${user._id}`);
      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) return <h1>Loading...</h1>;
  if (error) return JSON.stringify(error);
  if (user) {
    return (
      <>
        <h1 className="text-4xl font-bold mb-7">Profile</h1>
        <ProfileComponent followUser={followUser} user={user} />
      </>
    );
  }
};

export default ProfilePageOfUser;
