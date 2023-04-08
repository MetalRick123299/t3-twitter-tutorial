import { type RouterOutputs } from "@/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div
      key={post.id}
      className="flex items-center gap-5 border-b border-slate-400 p-4 text-xl"
    >
      <Image
        className="h-12 w-12 rounded-full"
        src={author.profilePicture}
        // This comment is required to make emmet work (its werid, i know)
        alt={`@${author.username}'s profile picture`}
        width={48}
        height={48}
      />
      <div className="flex flex-col">
        <div className="flex gap-2 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span className="font-thin">{`@${author.username}`}</span>
          </Link>
          <span>{`· ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span className="">{post.content}</span>
      </div>
    </div>
  );
};

export default PostView;
