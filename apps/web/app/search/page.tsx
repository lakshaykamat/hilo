"use client";
import React, { useEffect } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetcher, getMediaUrl } from "@/lib/utils";
import { User } from "@/types/User";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "@/lib/axios";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q");
  const { user: loggedInUser } = useAuth();

  // Fetch users only if searchTerm exists
  const {
    data: users,
    isLoading,
    error,
    mutate,
  } = useSWR(searchTerm ? `/users?username=${searchTerm}` : null, fetcher);

  const refreshUsers = () => {
    mutate(); // Revalidate the SWR data
  };

  useEffect(() => {
    if (searchTerm) {
      console.log("Search term:", searchTerm);
    }
  }, [searchTerm]);

  return (
    <div className="p-5">
      <Tabs defaultValue="peoples" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="posts">
            Posts
          </TabsTrigger>
          <TabsTrigger className="w-full" value="peoples">
            Peoples
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <PostSearchComponent />
        </TabsContent>
        <TabsContent value="peoples">
          <PeopleSearchComponent
            users={users}
            isLoading={isLoading}
            error={error}
            refreshUsers={refreshUsers}
            loggedInUser={loggedInUser}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PostSearchComponent = () => {
  return (
    <div className="bg-secondary p-10 rounded-lg">
      <h1 className="text-xl font-bold">Coming Soon...</h1>
      <p>Thank you for your patience!</p>
    </div>
  );
};

const PeopleSearchComponent = ({
  users,
  isLoading,
  error,
  loggedInUser,
  refreshUsers,
}: {
  users: User[];
  refreshUsers: () => void;
  loggedInUser: User;
  isLoading: boolean;
  error: any;
}) => {
  if (isLoading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-red-500">
        Error loading users. Please try again later.
      </p>
    );
  }

  // Filter out the logged-in user from the search results
  const filteredUsers = users?.filter((user) => user._id !== loggedInUser._id);

  if (!filteredUsers || filteredUsers.length === 0) {
    return <p>No users found for the search term.</p>;
  }

  const handleFollow = async (userID: string) => {
    try {
      await axiosInstance.post(`/users/follow/${userID}`);
      refreshUsers();
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  return (
    <div className="my-7 border max-w-xl mx-auto">
      {filteredUsers.map((user) => (
        <div
          key={user._id}
          className="flex items-center p-4 hover:bg-secondary justify-between rounded-lg"
        >
          <div className="flex gap-3">
            <Avatar className="w-16 h-16">
              <AvatarImage src={getMediaUrl(user.profilePicture)} />
            </Avatar>
            <div className="flex flex-col justify-center">
              <Link
                href={`/profile/${user.username}`}
                className="font-bold hover:underline"
              >
                {user.username}
              </Link>
              <span className="text-muted-foreground text-sm">{user.name}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => handleFollow(user._id)}
              size={"sm"}
              variant={
                user.followers?.some((f) => f._id === loggedInUser._id)
                  ? "destructive"
                  : "default"
              }
            >
              {user.followers?.some((f) => f._id === loggedInUser._id)
                ? "Unfollow"
                : "Follow"}
            </Button>
            <Link href={`/chats/${user.username}`}>
              <Button size={"sm"} variant={"outline"}>
                Send Message
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchPage;
