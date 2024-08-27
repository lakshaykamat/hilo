import React from "react";

type MessageItemProps = {
  senderUsername: string;
  senderID: string;
  userID: string;
  content: string;
  time: string;
  chatType: "private" | "group";
};

const MessageItem: React.FC<MessageItemProps> = ({
  senderUsername,
  senderID,
  userID,
  content,
  chatType,
  time,
}) => {
  const isOwnMessage = senderID === userID; //userID

  return (
    <div
      className={`flex mb-1 ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`p-3 rounded-md max-w-xs ${
          isOwnMessage ? "bg-primary text-white" : "bg-gray-200 text-black"
        }`}
      >
        {/* {chatType === "group" && !isOwnMessage && ( */}
        <div className="flex gap-3 justify-between">
          <p className="font-bold">{senderUsername}</p>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        {/* )} */}
        <p>{content}</p>
      </div>
    </div>
  );
};

export default MessageItem;
