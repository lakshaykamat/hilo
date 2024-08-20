import { Metadata } from "@/types/Post";

type PostContentProps = {
  fileType: string | undefined;
  fileUrl: string | undefined;
  content: string | undefined;
  id: string;
  isTexutalPost: boolean;
  metadata?: Metadata;
};

const PostContent = (props: PostContentProps) => {
  const isHorizontalVideo =
    props.metadata?.width &&
    props.metadata?.height &&
    props.metadata.width > props.metadata.height;

  const videoPaddingBottom = isHorizontalVideo ? "56.25%" : "125%";
  return (
    <div className="flex-grow my-3">
      {props.isTexutalPost && props.content && (
        <span
          dangerouslySetInnerHTML={{
            __html: props.content.replace(/\n/g, "<br>"),
          }}
        ></span>
      )}
      {props.fileType === "image" && props.fileUrl && (
        <img
          className="bg-gray-400 mx-auto rounded-lg shadow-md object-cover"
          src={`http://127.0.0.1:5000/${props.fileUrl}`}
          alt="Post Image"
        />
      )}

      {props.fileType === "video" && props.fileUrl && (
        // <div
        //   className="relative w-full h-0"
        //   style={{ paddingBottom: videoPaddingBottom }}
        // >
        <video
          //className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md object-cover"
          className="rounded-lg shadow-md object-cover w-full h-full"
          controls
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src={`http://127.0.0.1:5000/${props.fileUrl}`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        // </div>
      )}
    </div>
  );
};
export default PostContent;
