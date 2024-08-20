import { Separator } from "@/components/ui/separator";
import { Heart, Share, Bookmark, MessageCircle } from "lucide-react";

type PostActionsProps = {
  postState: any;
  shares: number;
  toggleLike: () => void;
  sharePost: () => void;
};

const PostActions = ({
  postState,
  shares,
  toggleLike,
  sharePost,
}: PostActionsProps) => (
  <div className="flex justify-between my-5">
    <div className="flex gap-2 sm:gap-5 flex-wrap">
      <ActionIcon
        icon={
          <Heart
            className={
              postState.postLike ? "text-red-500 w-5 h-5 fill-red-500" : ""
            }
          />
        }
        count={postState.postLikeCount}
        onClick={toggleLike}
      />
      <ActionIcon
        icon={<MessageCircle className="w-5 h-5" />}
        count={postState.comments.length}
      />
      <ActionIcon
        icon={<Share className="w-5 h-5" />}
        count={shares}
        onClick={sharePost}
      />
    </div>
    <ActionIcon
      icon={<Bookmark className="w-5 h-5" />}
      count={0}
      onClick={() => {}}
    />
  </div>
);

type ActionIconProps = {
  icon: React.ReactNode;
  count: number;
  onClick?: () => void;
};

const ActionIcon = ({ icon, count, onClick }: ActionIconProps) => (
  <div className="flex items-center gap-3 cursor-pointer" onClick={onClick}>
    {icon}
    <span>{count}</span>
    <Separator orientation="vertical" />
  </div>
);

export default PostActions;
