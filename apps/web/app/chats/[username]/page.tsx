"use client";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import ChatList from "../ChatList";
import ChatBox from "../ChatBox";
import { Message } from "@/types/Chats";
import useSocket from "@/app/hooks/useSocket";
import Error from "@/app/error";
import { useAuth } from "@/app/context/AuthContext";

export type SelectedChat = {
  name: string;
  conversationId: string;
  profilePicture: string;
  type: "group" | "private";
};

const ChatsUserPage = ({ params }: { params: { username: string } }) => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);
  const [chatRoomMessages, setChatRoomMessages] = useState<Message[]>([]);
  const socket = useSocket(user?.token);

  // Fetch all conversations of the logged-in user
  const {
    data: conversations,
    isLoading,
    error,
  } = useSWR(user ? `/conversations/${user._id}` : null, fetcher);

  // Handle selecting chat based on the username from params
  useEffect(() => {
    if (conversations && params.username) {
      const conversation = conversations.find((conv: any) =>
        conv.participants.some(
          (participant: any) => participant.username === params.username
        )
      );

      if (conversation) {
        setSelectedChat({
          name: params.username,
          conversationId: conversation._id,
          profilePicture:
            conversation.participants.find(
              (participant: any) => participant.username === params.username
            )?.profilePicture || "",
          type: conversation.type,
        });
      }
    }
  }, [conversations, params.username]);

  // Handle user logout case
  useEffect(() => {
    if (!user) {
      setSelectedChat(null);
      setChatRoomMessages([]);
    }
  }, [user]);

  if (!user) {
    return <p>Please log in to view your chats.</p>;
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
        {selectedChat && (
          <ChatBox
            selectedChat={selectedChat}
            socket={socket}
            loggedInUser={user}
            chatRoomMessages={chatRoomMessages}
            setChatRoomMessages={setChatRoomMessages}
          />
        )}
      </div>
    </div>
  );
};

export default ChatsUserPage;
