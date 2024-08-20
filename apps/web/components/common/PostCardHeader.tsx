import { formatTimestamp } from "@/lib/utils";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

type PostCardHeaderProps = {
  author: {
    profilePicture: string;
    name: string;
    username: string;
    _id: string;
  };
  createdAt: string;
};

const PostCardHeader = (props: PostCardHeaderProps) => {
  let userImage = "";
  if (props.author.profilePicture.startsWith("uploads\\")) {
    userImage = `http://127.0.0.1:5000/${props.author.profilePicture}`;
  } else {
    userImage = props.author.profilePicture;
  }
  return (
    <div className="flex items-center gap-3">
      <Avatar className="w-[2rem] h-[2rem]">
        <AvatarImage
          className="object-cover rounded-full"
          src={userImage}
          alt={`${props.author.name}'s profile picture`}
        />
      </Avatar>
      <div className="flex items-center gap-2">
        <Link className="font-bold" href={`/profile/${props.author.username}`}>
          {props.author.username}
        </Link>
        <span>•</span>
        <span className="text-sm text-muted-foreground">
          {formatTimestamp(props.createdAt)}
        </span>
      </div>
    </div>
  );
};
export default PostCardHeader;
