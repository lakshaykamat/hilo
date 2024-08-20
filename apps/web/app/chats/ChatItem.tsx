import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { getMediaUrl } from "@/lib/utils";

type ChatItemProps = {
  profilePicture: string;
  name: string;
  message: string;
  chatRoomID: string;
  senderID: string;
  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
  type: "private" | "group";
};

const ChatItem: React.FC<ChatItemProps> = ({
  profilePicture,
  name,
  message,
  chatRoomID,
  setSelectedChat,
  type,
}) => {
  const setChat = () => {
    setSelectedChat({
      name,
      conversationId: chatRoomID,
      profilePicture,
      type,
    });
  };

  return (
    <div
      onClick={setChat}
      className="flex flex-row  p-2 rounded border gap-2 items-center cursor-pointer"
    >
      <Avatar className="w-14 h-14">
        <AvatarImage
          src={getMediaUrl(profilePicture)}
          alt={`${name}'s profile picture`}
        />
      </Avatar>
      <div className="flex flex-col">
        <h4 className="text-md font-bold">{name}</h4>
        <p className="text-sm text-muted-foreground">{message || "Wave 👋"}</p>
      </div>
    </div>
  );
};

export default ChatItem;
