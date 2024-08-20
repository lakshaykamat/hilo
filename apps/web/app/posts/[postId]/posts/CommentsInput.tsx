import { Button } from "@/components/ui/button";
import { PostState } from "../page";

type CommentInputProps = {
  commentText: string;
  setPostState: React.Dispatch<React.SetStateAction<any>>;
  addComment: () => void;
};

const CommentInput = ({
  commentText,
  setPostState,
  addComment,
}: CommentInputProps) => (
  <div className="flex items-center gap-4">
    <input
      value={commentText}
      onChange={(e) =>
        setPostState((prevState: PostState) => ({
          ...prevState,
          commentText: e.target.value,
        }))
      }
      className="bg-inherit dark:text-black rounded outline-1 outline px-2 outline-neutral-200 focus:bg-neutral-300 focus:outline-none text-sm w-full p-1"
      placeholder="Write your thoughts"
    />
    <Button onClick={addComment}>Comment</Button>
  </div>
);

export default CommentInput;
