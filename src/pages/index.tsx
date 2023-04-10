import { type NextPage } from "next";
import { api } from "@/utils/api";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

import Image from "next/image";
import { LoadingSpinner, LoadingPage } from "@/components/LoadingSpinner";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "@/components/Layout";
import PostView from "@/components/PostView";

import { z } from "zod";

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap to use cache for <Feed /> request
  api.posts.getAll.useQuery();

  // Return empty div if user isn't loaded
  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn ? (
          <SignInButton />
        ) : (
          <>
            <SignOutButton />
            <CreatePostWizard />
          </>
        )}
      </div>
      <Feed />
    </PageLayout>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Something Went Wrong</div>;

  return (
    <div>
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to create post");
      }
    },
  });

  if (!user) return null;

  return (
    <div className="flex w-full gap-5">
      <Image
        className="h-16 w-16 rounded-full"
        src={user.profileImageUrl}
        alt="Profile Image"
        width={64}
        height={64}
      />
      <input
        type="text"
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
        value={input}
        onChange={(e) => {
          const value = e.target.value;
          const isEmoji = z.string().emoji().safeParse(value).success;
          if (value === "" || isEmoji) {
            setInput(e.target.value);
          }
        }}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (input !== "" && e.key === "Enter") {
            mutate({ content: input });
          }
        }}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })} disabled={isPosting}>
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

export default Home;
