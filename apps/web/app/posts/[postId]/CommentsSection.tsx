import { Comment } from "@/types/Post";
import CommentComponent from "./CommentCard";

type CommentsSectionProps = {
  comments: Comment[];
  postID: string;
};

const CommentsSection = ({ comments, postID }: CommentsSectionProps) => (
  <div>
    {comments.map((comment) => (
      <CommentComponent
        key={comment._id}
        postID={postID}
        commentID={comment._id}
        content={comment.text}
        author={comment.author}
        replies={comment.replies}
      />
    ))}
  </div>
);

export default CommentsSection;
