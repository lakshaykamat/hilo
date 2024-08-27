import { Metadata } from "@/types/Post";
import Image from "next/image";

type PostContentProps = {
  fileType?: string;
  file?: string;
  metadata?: Metadata;
  content: string | null;
};

const PostContent = ({
  fileType,
  file,
  metadata,
  content,
}: PostContentProps) => {
  const isHorizontalVideo = metadata && metadata.width > metadata.height;

  return (
    <div className="my-4">
      {fileType === "image" && file && (
        <img
          className="w-full mb-4 rounded-lg shadow-md object-cover"
          src={`http://127.0.0.1:5000/${file}`}
          alt="Post Image"
        />
      )}
      {fileType === "video" && file && (
        <div
          className="relative w-full h-0"
          style={{
            paddingBottom: isHorizontalVideo ? "56.25%" : "125%", // Adjust padding for aspect ratios
          }}
        >
          <video
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md object-cover"
            controls
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={`http://127.0.0.1:5000/${file}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      {content && (
        <p
          dangerouslySetInnerHTML={{
            __html: content.replace(/\n/g, "<br>"),
          }}
          className="mt-2 text-base"
        />
      )}
    </div>
  );
};

export default PostContent;
