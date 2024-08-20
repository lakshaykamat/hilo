import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MessageItem from "./MessageItem";
import axiosInstance from "@/lib/axios";
import { Message } from "@/types/Chats";
import { SelectedChat } from "./page";
import { formatDate, getMediaUrl } from "@/lib/utils";
import { User } from "@/types/User";
import { MessageCircle } from "lucide-react";

type ChatBoxProps = {
  selectedChat: SelectedChat | null;
  socket: any;
  chatRoomMessages: Message[];
  loggedInUser: User;
  setChatRoomMessages: React.Dispatch<React.SetStateAction<any[]>>;
};

const ChatBox: React.FC<ChatBoxProps> = ({
  selectedChat,
  socket,
  chatRoomMessages,
  setChatRoomMessages,
  loggedInUser,
}) => {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat) {
        try {
          const response = await axiosInstance.get(
            `/messages/${selectedChat.conversationId}`
          );
          setChatRoomMessages(response.data);
          console.log(response.data);
          scrollToBottom();
        } catch (error) {
          console.error("Failed to fetch messages", error);
        }
      }
    };
    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit("joinRoom", selectedChat.conversationId);
      socket.on("newMessage", (message: Message) => {
        setChatRoomMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom();
      });

      return () => {
        socket.emit("leaveRoom", selectedChat.conversationId);

        // Cleanup listener when component unmounts or chat changes
        socket.off("newMessage");
      };
    }
  }, [socket, selectedChat]);

  const sendMessage = async () => {
    if (selectedChat && messageText.trim()) {
      try {
        const response = await axiosInstance.post(`/messages`, {
          text: messageText,
          conversationId: selectedChat.conversationId,
        });
        socket.emit("sendMessage", response.data);
        // setChatRoomMessages((prevMessages) => [...prevMessages, response.data]);
        setMessageText("");
        scrollToBottom();
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!selectedChat)
    return (
      <div className="flex flex-col items-center justify-center border w-full">
        <div className="border rounded-full p-10">
          <MessageCircle className="w-[7rem] h-[7rem]" />
        </div>
        <div className="flex flex-col items-center my-3">
          <p className="text-xl font-bold">Your messages</p>
          <p className="text-muted-foreground">
            Send a message to start a chat.
          </p>
          <Button className="mt-3">Send Message</Button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col outline-secondary outline h-[80vh] w-full rounded-lg">
      {/* Header */}
      <div className="flex border-b py-3 px-5 gap-3 items-center">
        <img
          className="w-10 h-10 rounded-full"
          src={getMediaUrl(selectedChat.profilePicture)}
          alt=""
        />
        <p className="text-xl font-bold">{selectedChat.name}</p>
      </div>

      {/* Message Container */}
      <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
        {chatRoomMessages.map((message, index) => (
          <MessageItem
            senderUsername={message.sender.username}
            key={index}
            time={formatDate(message.createdAt).split(",")[1]}
            senderID={message.sender._id}
            userID={loggedInUser._id}
            content={message.text}
            chatType={selectedChat.type}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex gap-2 p-4 items-center border-t">
        <Input
          value={messageText}
          placeholder="Send message..."
          className="flex-grow py-4 px-5"
          type="text"
          onChange={(e) => setMessageText(e.target.value)}
        />
        <Button onClick={sendMessage} className="py-4 px-8">
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;
