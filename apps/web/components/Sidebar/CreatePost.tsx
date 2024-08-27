import {
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@radix-ui/react-dialog";
import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import axiosInstance from "@/lib/axios";
import { ToastAction } from "@radix-ui/react-toast";
import { toast } from "../ui/use-toast";
import Link from "next/link";
import { UploadCloud } from "lucide-react";

type Props = {};

const CreatePost = (props: Props) => {
  const [postContent, setPostContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      const fileType = file.type.split("/")[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fileType === "image") {
          setImagePreview(reader.result as string);
          setVideoPreview(null); // Clear video preview if an image is selected
        } else if (fileType === "video") {
          setVideoPreview(reader.result as string);
          setImagePreview(null); // Clear image preview if a video is selected
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const createPost = async () => {
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
        setPostContent("");
        setSelectedFile(null);
        setImagePreview(null);
        setVideoPreview(null);
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
    <DialogHeader>
      <DialogTitle className="mb-3 text-2xl">Create Post</DialogTitle>
      <DialogDescription className="flex flex-col gap-3 my-4">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="text">
              Thoughts
            </TabsTrigger>
            <TabsTrigger className="w-full" value="media">
              Memories
            </TabsTrigger>
          </TabsList>
          <TabsContent value="text">
            <TextualPost textContent={postContent} setText={setPostContent} />
          </TabsContent>
          <TabsContent value="media">
            <MediaPost
              handleFileChange={handleFileChange}
              imagePreview={imagePreview}
              videoPreview={videoPreview}
              textContent={postContent}
              setText={setPostContent}
              onUploadClick={handleUploadClick}
              fileInputRef={fileInputRef}
            />
          </TabsContent>
        </Tabs>
        <DialogClose asChild>
          <Button onClick={createPost} disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </DialogClose>
      </DialogDescription>
    </DialogHeader>
  );
};
const TextualPost = ({
  textContent,
  setText,
}: {
  textContent: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <Textarea
      className="text-primary h-32"
      value={textContent}
      onChange={(e) => setText(e.target.value)}
      placeholder="Share your thoughts..."
    />
  );
};

const MediaPost = ({
  handleFileChange,
  imagePreview,
  videoPreview,
  textContent,
  setText,
  onUploadClick,
  fileInputRef,
}: {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  videoPreview: string | null;
  textContent: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  onUploadClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}) => {
  return (
    <>
      <Button
        variant={"ghost"}
        onClick={onUploadClick}
        className="upload-btn mx-auto w-full"
      >
        <UploadCloud className="mr-2 w-4 h-4" />
        Upload Media
      </Button>
      <input
        ref={fileInputRef}
        onChange={handleFileChange}
        type="file"
        accept=".jpeg,.jpg,.png,.gif,.mp4,.mov,.avi,.mkv,.webm"
        className="hidden"
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
      {videoPreview && (
        <div className="mt-4 flex justify-center">
          <video
            src={videoPreview}
            controls
            className="max-w-sm rounded object-cover shadow-lg"
          />
        </div>
      )}
      <Textarea
        className="text-primary mt-4 h-16"
        value={textContent}
        onChange={(e) => setText(e.target.value)}
        placeholder="Caption (describe your emotions)"
      />
    </>
  );
};

export default CreatePost;
