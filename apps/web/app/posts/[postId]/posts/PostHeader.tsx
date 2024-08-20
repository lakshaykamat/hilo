import { formatDate } from "@/lib/utils";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

type PostHeaderProps = {
  author: any;
  createdAt: string;
};

const PostHeader = ({ author, createdAt }: PostHeaderProps) => (
  <div className="flex gap-3 items-start mb-4">
    <Link href={`/profile/${author.username}`}>
      <Avatar className="w-14 h-14">
        <AvatarImage
          className="w-14 rounded-full"
          src={
            author.profilePicture.startsWith("uploads\\")
              ? `http://127.0.0.1:5000/${author.profilePicture}`
              : author.profilePicture
          }
          alt={`${author.username}'s profile`}
        />
      </Avatar>
    </Link>
    <div className="flex flex-col w-full">
      <div className="flex justify-between">
        <h1 className="text-lg sm:text-xl font-semibold">{author.name}</h1>
        <p className="text-muted-foreground mt-2 text-sm text-end">
          {formatDate(createdAt)}
        </p>
      </div>
      <h2 className="text-sm text-muted-foreground">{author.username}</h2>
    </div>
  </div>
);

export default PostHeader;
