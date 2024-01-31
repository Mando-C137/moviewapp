"use client";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { likeMovie } from "../../../server/actions";
export default function LikeButton({
  userId,
  tmdbId,
  isMovieLiked,
}: PropsWithChildren<{
  isMovieLiked: boolean;
  userId: string;
  tmdbId: number;
}>) {
  const [liked, setLiked] = useState(isMovieLiked);

  return (
    <button
      className="relative h-6 w-6"
      onClick={() =>
        void (async () => {
          const isLiked = await likeMovie(userId, !liked, tmdbId);
          setLiked(isLiked === "error" ? false : isLiked);
        })()
      }
    >
      {liked && <SolidHeartIcon className="absolute inset-0" fill="#db2777" />}
      {!liked && <OutlineHeartIcon className="absolute inset-0" />}
    </button>
  );
}
