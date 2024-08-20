"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Heart, Reply as ReplyIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { User } from "@/types/User";
import { Reply } from "@/types/Post";

type CommentProps = {
  content: string;
  postID: string;
  commentID: string;
  author: User;
  replies: Reply[];
};

const CommentComponent = (props: CommentProps) => {
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(props.replies);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const replyToComment = async (content: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/posts/${props.postID}/comments/${props.commentID}/replies`,
        { content: content }
      );
      if (response.data) {
        setReplies((prevReplies) => [...prevReplies, response.data]);
        setReplyText("");
      }
    } catch (error) {
      setError("Failed to add reply. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-7">
      <div className="mb-2 p-5 flex gap-3 items-center justify-between drop-shadow bg-secondary rounded">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage
              src={props.author.profilePicture}
              className="w-10 h-10"
              alt={`${props.author.username}'s profile`}
            />
          </Avatar>
          <div className="flex gap-1 flex-col">
            <a
              href={`/profile/${props.author._id}`}
              className="font-semibold text-base hover:underline"
            >
              {props.author.username}
            </a>
            <p className="text-sm">{props.content}</p>

            <Dialog>
              <DialogTrigger>
                <div className="flex items-center gap-1">
                  <ReplyIcon className="w-4 h-4" />
                  <p className="text-xs">Reply</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-2">
                    Replying to comment...
                  </DialogTitle>
                  <DialogDescription className="flex flex-col gap-2">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to @${props.author.username}`}
                      disabled={loading}
                    />
                    {error && <p className="text-red-500 my-1">{error}</p>}
                    <Button
                      onClick={() => replyToComment(replyText)}
                      disabled={loading}
                    >
                      {loading ? "Replying..." : "Reply"}
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Heart className="w-4 cursor-pointer" />
      </div>
      <div className="ml-14">
        {replies.map((reply) => (
          <div
            key={reply._id}
            className="mb-2 p-5 flex gap-3 items-center justify-between drop-shadow bg-secondary rounded"
          >
            <div className="flex items-start gap-3">
              <Avatar className="w-7 h-7">
                <AvatarImage
                  src={reply.author.profilePicture}
                  alt={`${reply.author.username}'s profile`}
                />
              </Avatar>
              <div>
                <p className="font-semibold text-md">{reply.author.username}</p>
                <p>{reply.text}</p>
              </div>
            </div>
            <Heart className="w-4 cursor-pointer" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentComponent;
