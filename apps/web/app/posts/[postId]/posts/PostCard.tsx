import { Card } from "@/components/ui/card";
import PostActions from "./PostActions";
import PostContent from "./PostContent";
import PostHeader from "./PostHeader";
import CommentInput from "./CommentsInput";
import { Post } from "@/types/Post";

type PostCardProps = {
  post: Post;
  postState: any;
  toggleLike: () => void;
  sharePost: () => void;
  setPostState: React.Dispatch<React.SetStateAction<any>>;
  addComment: () => void;
};

const PostCard = (props: PostCardProps) => {
  return (
    <Card className="p-4 mb-7">
      <PostHeader author={props.post.author} createdAt={props.post.createdAt} />
      <PostContent
        fileType={props.post.media.fileType}
        file={props.post.media.file}
        metadata={props.post.media.metadata}
        content={props.post.content}
      />
      <PostActions
        shares={props.post.shares.length}
        postState={props.postState}
        toggleLike={props.toggleLike}
        sharePost={props.sharePost}
      />
      <CommentInput
        commentText={props.postState.commentText}
        setPostState={props.setPostState}
        addComment={props.addComment}
      />
    </Card>
  );
};
export default PostCard;
