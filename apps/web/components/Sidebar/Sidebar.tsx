"use client";
import {
  Bookmark,
  Home,
  MessageCircle,
  Pen,
  Search,
  Settings,
  SquarePlus,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { getMediaUrl } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import { ToastAction } from "@radix-ui/react-toast";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";
import CreatePost from "./CreatePost";
import SidebarMoreItems from "./SidebarMoreItems";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <Card className="rounded-none fixed flex-col px-5 py-7 justify-between hidden h-screen md:flex min-w-[15rem] max-w-[15rem]">
      <div>
        <h1 className="text-2xl font-bold text-primary mt-7 mb-10">Hilo</h1>
        <div className="flex flex-col gap-10">
          <SideBarItem
            path="/"
            pathname={pathname}
            label="Home"
            icon={<Home />}
          />
          <SideBarItem pathname={pathname} label="Search" icon={<Search />} />

          <Dialog>
            <DialogTrigger>
              <div>
                <span className={`flex gap-4 rounded`}>
                  <SquarePlus />
                  <span>Create</span>
                </span>
              </div>
            </DialogTrigger>
            <DialogContent>
              <CreatePost />
            </DialogContent>
          </Dialog>

          <SideBarItem
            pathname={pathname}
            path="/saves"
            label="Saved"
            icon={<Bookmark />}
          />
          <SideBarItem
            pathname={pathname}
            path="/chats"
            label="Messages"
            icon={<MessageCircle />}
          />
          {user && (
            <SideBarItem
              path="/profile"
              pathname={pathname}
              label="Profile"
              icon={
                <img
                  src={getMediaUrl(user.profilePicture)}
                  className="w-8 h-8 rounded-full"
                />
              }
            />
          )}
          <SideBarItem
            path="/settings"
            pathname={pathname}
            label="Settings"
            icon={<Settings />}
          />
        </div>
      </div>

      <SidebarMoreItems />
    </Card>
  );
};

type SideBarItemProps = {
  pathname: string;
  label: string;
  icon: any;
  path?: string;
};
const SideBarItem = (props: SideBarItemProps) => {
  const isActivePage = props.pathname === props.path;
  return (
    <div>
      {props.path ? (
        <Link
          href={props.path}
          className={`flex gap-4 items-center rounded hover:cursor-pointer`}
        >
          {props.icon}
          <span className={isActivePage ? "font-bold" : ""}>{props.label}</span>
        </Link>
      ) : (
        <div className={`flex gap-4 items-center rounded hover:cursor-pointer`}>
          {props.icon}
          <span className={isActivePage ? "font-bold" : ""}>{props.label}</span>
        </div>
      )}
    </div>
  );
};
const SideBarItem2 = (props: {
  pathname: string;
  label: string;
  icon: any;
  path: string;
}) => {
  return (
    <div className="hover:bg-secondary p-3 rounded-lg hover:scale-105 transition-all duration-150">
      <Link href={props.path} className={`flex rounded hover:cursor-pointer`}>
        {props.icon}
      </Link>
    </div>
  );
};
export const SidBarMini = () => {
  const pathname = usePathname();
  const [postContent, setPostContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const createPost = async () => {
    // Ensure the user has entered content or selected a file
    if (!postContent && !selectedFile) {
      toast({
        title: "Error",
        description: "Please provide content or select a file.",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("media", selectedFile);
      }
      if (postContent) {
        formData.append("content", postContent);
      }

      const response = await axiosInstance.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        toast({
          title: "Post Uploaded",
          description: "Check your profile.",
          action: (
            <ToastAction altText="View Post">
              <Link href={`/posts/${response.data._id}`}>View Post</Link>
            </ToastAction>
          ),
        });
        setPostContent(""); // Clear the post content
        setSelectedFile(null); // Clear the selected file
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload the post.";
      toast({
        title: "Upload Failed",
        description: errorMessage,
      });
      console.error("Post upload error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="rounded-none fixed flex-col items-center py-14 justify-between hidden h-screen md:flex min-w-[5rem]">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-14">Hilo</h1>
        <div className="flex flex-col gap-10 items-center">
          <SideBarItem2
            path="/"
            pathname={pathname}
            label="Home"
            icon={<Home />}
          />

          <Dialog>
            <DialogTrigger>
              <div className="hover:bg-secondary p-3 rounded-lg hover:scale-105 transition-all duration-150">
                <span>
                  <SquarePlus />
                </span>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-3 text-2xl">Create Post</DialogTitle>
                <DialogDescription className="flex flex-col gap-3 my-4">
                  <Input
                    onChange={handleFileChange}
                    type="file"
                    accept=".jpeg,.jpg,.png,.gif,.mp4,.mov,.avi,.mkv,.webm"
                  />
                  {imagePreview && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={imagePreview}
                        alt="Image Preview"
                        className="max-w-sm rounded object-cover shadow-lg"
                      />
                    </div>
                  )}
                  <Textarea
                    className="text-primary h-32"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Share your thougts..."
                  />
                  <DialogClose asChild>
                    <Button onClick={createPost} disabled={isLoading}>
                      {isLoading ? "Uploading..." : "Upload"}
                    </Button>
                  </DialogClose>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <SideBarItem2
            pathname={pathname}
            path="/saves"
            label="Saved Post"
            icon={<Bookmark />}
          />
          <SideBarItem2
            pathname={pathname}
            path="/chats"
            label="Chats"
            icon={<MessageCircle />}
          />
          <SideBarItem2
            path="/profile"
            pathname={pathname}
            label="Profile"
            icon={<User />}
          />
          <SideBarItem2
            path="/settings"
            pathname={pathname}
            label="Settings"
            icon={<Settings />}
          />
        </div>
      </div>
    </Card>
  );
};
const BottomBar = () => {
  const [postContent, setPostContent] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();

  const createPost = async () => {
    setLoading(true);
    if (!postContent) return;
    try {
      const response = await axiosInstance.post("/posts", {
        content: postContent,
      });
      if (response.data) {
        toast({
          title: "Post uploaded",
          description: "Check profile",
          action: <ToastAction altText="View Post">View Post</ToastAction>,
        });
      }
    } catch (error: any) {
      toast({
        title: error.response?.data?.message || error.message,
        description: "Failed To Upload",
      });
      console.log(error);
    }
    setLoading(false);
  };
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 border-t-[1px] flex w-full md:hidden">
      <div className="flex items-center justify-center w-full gap-12 bg-card drop-shadow">
        <a
          href="/"
          className={`flex flex-col items-center text-sm justify-center py-4 rounded px-3 sm:px-7 ${
            pathname === "/"
              ? "bg-primary dark:text-black text-white"
              : "hover:bg-secondary"
          }`}
        >
          <Home />
        </a>

        <Dialog>
          <DialogTrigger>
            <div
              className={`flex flex-col items-center text-sm justify-center py-4 rounded px-3 sm:px-7`}
            >
              <Pen />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-3 text-2xl">Create Post</DialogTitle>
              <DialogDescription className="flex flex-col gap-3 my-4">
                <Textarea
                  className="text-primary"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share your thougts..."
                />
                <DialogClose asChild>
                  <Button onClick={createPost} disabled={isLoading}>
                    {isLoading ? "Uploading..." : "Upload"}
                  </Button>
                </DialogClose>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <a
          href="/profile"
          className={`flex flex-col items-center text-sm justify-center py-4 rounded px-3 sm:px-7 ${
            pathname === "/profile"
              ? "bg-primary dark:text-black text-white"
              : "hover:bg-secondary"
          }`}
        >
          <User />
        </a>
        <a
          href="/settings"
          className={`flex flex-col items-center text-sm justify-center py-4 rounded px-3 sm:px-7 ${
            pathname === "/settings"
              ? "bg-primary dark:text-black text-white"
              : "hover:bg-secondary"
          }`}
        >
          <Settings />
        </a>
      </div>
    </div>
  );
};
export { Sidebar, BottomBar };
