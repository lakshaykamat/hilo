"use client";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { useAuth } from "../context/AuthContext";
import Error from "../error";
import useSocket from "../hooks/useSocket";
import ChatList from "./ChatList";
import ChatBox from "./ChatBox";
import { Message } from "@/types/Chats";
export type SelectedChat = {
  name: string;
  conversationId: string;
  profilePicture: string;
  type: "group" | "private";
};
const ChatsPage = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);
  const [chatRoomMessages, setChatRoomMessages] = useState<Message[]>([]);
  const socket = useSocket(user?.token);

  const {
    data: conversations,
    isLoading,
    error,
  } = useSWR(user ? `/conversations/${user._id}` : null, fetcher);

  // Handle cases where user is null
  useEffect(() => {
    if (!user) {
      setSelectedChat(null);
      setChatRoomMessages([]);
    }
  }, [user]);

  if (!user) {
    return <p>Please log in to view your chats.</p>; // Early return if user is null
  }

  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <Error />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-3 h-[70vh]">
        <ChatList
          conversations={conversations}
          user={user}
          setSelectedChat={setSelectedChat}
        />
        {/* {selectedChat && ( */}
        <ChatBox
          selectedChat={selectedChat}
          socket={socket}
          loggedInUser={user}
          chatRoomMessages={chatRoomMessages}
          setChatRoomMessages={setChatRoomMessages}
        />
        {/* )} */}
      </div>
    </div>
  );
};

export default ChatsPage;
