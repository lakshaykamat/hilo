import { PostsPage } from "@/components/common/PostCard";
import { Button } from "@/components/ui/button";
import { Post } from "@/types/Post";
import { User } from "@/types/User";
import { useAuth } from "../context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";

type UserWithPosts = User & {
  posts: Post[];
};
const ProfileComponent = ({
  user,
  followUser,
}: {
  user: UserWithPosts;
  followUser?: () => void;
}) => {
  const { user: LoggedInUser } = useAuth();

  return (
    <div className="flex flex-col items-center md:items-start mb-20 w-full max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full text-secondary-foreground gap-6 md:gap-10 p-6 bg-secondary shadow-lg rounded-lg">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Image
            width={128}
            height={128}
            objectFit="cover"
            className="rounded-full object-cover border-2 border-primary"
            src={
              user.profilePicture.startsWith("uploads\\")
                ? "http://127.0.0.1:5000/" + user.profilePicture
                : user.profilePicture
            }
            alt={user.username}
          />
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <span className="text-sm text-muted-foreground">
              @{user.username}
            </span>
          </div>
        </div>
        <div className="flex justify-center md:justify-start gap-8 text-center md:text-left">
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold">{user.posts.length}</span>
            <span className="text-sm">Posts</span>
          </div>

          <Dialog>
            <DialogTrigger>
              <div className="flex flex-col items-center">
                <span className="text-xl font-semibold">
                  {user.followers && user.followers.length}
                </span>
                <span className="text-sm">Followers</span>
              </div>
            </DialogTrigger>
            <DialogContent className="w-[20rem]">
              <DialogHeader>
                <DialogTitle>Followers</DialogTitle>
                <DialogDescription>Your followers worldwide.</DialogDescription>
              </DialogHeader>
              <div className="h-[20rem] overflow-y-auto">
                {user.followers &&
                  user.followers.map((follower) => (
                    <Link
                      key={follower._id}
                      href={`/profile/${follower.username}`}
                    >
                      <div className="bg-secondary flex items-center gap-2 p-3 rounded">
                        <img
                          className="w-11 h-11 rounded-full"
                          src={
                            follower.profilePicture.startsWith("uploads\\")
                              ? `http://127.0.0.1:5000/${follower.profilePicture}`
                              : follower.profilePicture
                          }
                          alt={follower.username}
                        />
                        <div className="flex flex-col">
                          <span>{follower.name}</span>
                          <span className="text-xs text-muted-foreground">
                            @{follower.username}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger>
              <div className="flex flex-col items-center">
                <span className="text-xl font-semibold ">
                  {user.following && user.following.length}
                </span>
                <span className="text-sm">Following</span>
              </div>
            </DialogTrigger>
            <DialogContent className="w-[20rem]">
              <DialogHeader>
                <DialogTitle>Following</DialogTitle>
                <DialogDescription>Users you follow.</DialogDescription>
              </DialogHeader>
              <div className="h-[20rem] overflow-y-auto">
                {user.following &&
                  user.following.map((followingUser) => (
                    <Link
                      key={followingUser._id}
                      href={`/profile/${followingUser._id}`}
                    >
                      <div className="bg-secondary flex items-center gap-2 p-3 rounded">
                        <img
                          className="w-11 h-11 rounded-full"
                          src={
                            followingUser.profilePicture.startsWith("uploads\\")
                              ? `http://127.0.0.1:5000/${followingUser.profilePicture}`
                              : followingUser.profilePicture
                          }
                          alt={followingUser.username}
                        />
                        <div className="flex flex-col">
                          <span>{followingUser.name}</span>
                          <span className="text-xs text-muted-foreground">
                            @{followingUser.username}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {LoggedInUser && LoggedInUser._id !== user._id && (
        <div className="w-full mt-5 gap-3 flex items-center justify-center">
          {user.followers &&
          user.followers.some(
            (follower) => follower._id === LoggedInUser._id
          ) ? (
            <Button
              onClick={followUser}
              className="w-full"
              variant={"destructive"}
            >
              Unfollow
            </Button>
          ) : (
            <Button
              onClick={followUser}
              className="w-full"
              variant={"secondary"}
            >
              Follow
            </Button>
          )}
          <Button className="w-full" variant={"outline"}>
            Message
          </Button>
        </div>
      )}

      {/* Posts Section */}
      <div className="mt-10 w-full">
        <h1 className="text-3xl font-bold mb-8">All Posts</h1>
        <PostsPage posts={user.posts} />
      </div>
    </div>
  );
};

export default ProfileComponent;
