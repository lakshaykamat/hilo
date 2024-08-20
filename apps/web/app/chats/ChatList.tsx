import React from "react";
import ChatItem from "./ChatItem";
import { Conversation } from "@/types/Chats";
import { User } from "@/types/User";

type ChatListProps = {
  conversations: Conversation[];
  user: User;
  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
};

const ChatList: React.FC<ChatListProps> = ({
  conversations,
  user,
  setSelectedChat,
}) => {
  return (
    <div className="flex gap-3 w-[25rem] basis2/4 flex-col overflow-auto">
      {conversations && conversations.length > 0 ? (
        conversations.map((conversation) => {
          if (conversation.isGroupChat) {
            return (
              <ChatItem
                key={conversation._id}
                senderID={user._id}
                setSelectedChat={setSelectedChat}
                chatRoomID={conversation._id}
                profilePicture={conversation.groupPicture}
                name={conversation.groupName}
                message={conversation.lastMessage?.text || ""}
                type="group"
              />
            );
          } else {
            // In private chat, find the participant who is not the logged-in user
            const otherParticipant = conversation.participants.find(
              (participant) => participant._id !== user._id
            );

            return (
              <ChatItem
                key={conversation._id}
                senderID={user._id}
                setSelectedChat={setSelectedChat}
                chatRoomID={conversation._id}
                profilePicture={otherParticipant?.profilePicture || ""}
                name={otherParticipant?.name || "Unknown"}
                message={conversation.lastMessage?.text || ""}
                type="private"
              />
            );
          }
        })
      ) : (
        <p>No chat rooms available</p>
      )}
    </div>
  );
};

export default ChatList;
