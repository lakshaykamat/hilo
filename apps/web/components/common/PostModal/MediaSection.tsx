import { Post } from "@/types/Post";

const MediaSection = ({
  isImagePost,
  isVideoPost,
  isTextPost,
  post,
}: {
  isImagePost: boolean;
  isVideoPost: boolean;
  isTextPost: boolean;
  post: Post;
}) => {
  return (
    <div className="w-full border-r flex items-center justify-center">
      {isImagePost && (
        <img
          className="object-contain max-h-[90vh] w-full"
          src={`http://127.0.0.1:5000/${post.media.file}`}
          alt={`${post.author.username}'s post media`}
        />
      )}

      {isVideoPost && (
        <div className="relative w-full h-0 pb-[56.25%]">
          {/* 16:9 aspect ratio (56.25%) */}
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            controls
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="https://github.com/lakshaykamat.png"
            src={`http://127.0.0.1:5000/${post.media.file}`}
          >
            <source
              src={`http://127.0.0.1:5000/${post.media.file}`}
              type={post.media.fileType}
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {isTextPost && (
        <div className="text- p-8 text-xl max-h-[90vh] w-full">
          <p
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/\n/g, "<br>"),
            }}
          ></p>
        </div>
      )}
    </div>
  );
};
export default MediaSection;
