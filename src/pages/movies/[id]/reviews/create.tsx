import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getMovieByTitleId } from "../../../../server/utils/database/movie";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getReviewByMovieIdAndUserId } from "../../../../server/utils/database/review";
import serialize from "../../../../server/utils/database/serialize";
import { getServerAuthSession } from "../../../../server/auth";
import * as TMDB_API from "../../../../server/utils/tmdb_api";
import { RankingListbox } from "../../../../components/movierank/MovieRank";
import Routepage from "../../../../components/Route/Routepage";
import { useRegisterTreeData } from "../../../../store/NavStore";
const Review = ({
  movie,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useRegisterTreeData({
    type: "movie",
    name: movie.title,
    href: `movies/${movie.title}`,
  });

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const [rating, setRating] = useState<number | null>(5);
  //const starArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [title, setTitle] = React.useState("");
  const [review, setReview] = React.useState("");
  const [creationLoading, setCreationLoading] = React.useState(false);

  const { data: session } = useSession();

  const router = useRouter();

  useAutosizeTextArea(textAreaRef.current, review, 100);

  if (!session) {
    return <div>Unauth</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };

  const getLongestSentence = (text: string) => {
    return text.split(".")[0];
  };

  const isDisabled = title.trim() === "" || review.trim() === "";

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    setCreationLoading(true);
    try {
      const response = await axios.post<{ url: string }>(
        `/api/reviewers/${session?.user.id as string}/reviews`,
        {
          movieId: movie.tmdb_id,
          title: title,
          content: review,
          rating: rating,
        }
      );

      setCreationLoading(false);
      await router.push(response.data.url);
      setCreationLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Routepage
      name={movie.title}
      action={{
        type: "reviewer",
        href: `reviewers/${session.user.id}`,
        name: session.user.name ?? "no user",
      }}
    >
      <div className="flex flex-col items-center">
        <div className="text-2xl font-bold text-primary-600">
          {movie.title} ({new Date(movie.release_date).getFullYear()})
        </div>

        <div className="mt-4 flex flex-col items-center">
          <p className="px-2 text-center font-semibold text-mygray-500">
            {getLongestSentence(movie.overview)}.
          </p>
          <div className="mt-4">
            <Image
              className="rounded-lg"
              width={300}
              height={100}
              src={TMDB_API.backdroppathImagepath(movie.backdrop_path)}
              alt={`Image of${movie.title}`}
            />
          </div>
        </div>

        <div className="flex-col-p-2-bg-mygray-300 flex">
          {/*         <div className="grid grid-cols-5">
          {starArray.map((star) => (
            <StarIcon
              key={star}
              className={`h-6 w-6 ${
                star <= rating ? "text-yellow-500" : "text-mygray-500"
              } `}
              onClick={() => setRating(star)}
            ></StarIcon>
          ))}
        </div> */}
        </div>

        <form
          className="mr-auto mt-4 w-full rounded bg-mygray-200 p-2 shadow"
          onSubmit={(e) => void handleSubmit(e)}
        >
          <div className="flex flex-col">
            <label
              htmlFor="title"
              className="text-lg font-semibold text-mygray-600"
            >
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={movie.title}
              type="text"
              id="title"
              required
              maxLength={50}
              className="focus:border-1 rounded-lg border-2 border-primary-300
            bg-slate-100 p-2 focus:border-primary-400 focus:no-underline focus:ring-1 focus:ring-primary-400"
            />
          </div>

          <div className="mt-2 flex w-full flex-col">
            <label className="text-lg font-semibold text-mygray-600">
              Rating
            </label>
            <RankingListbox
              selectedRank={rating}
              setSelectedRank={setRating}
            ></RankingListbox>
          </div>

          <div className="mt-2 flex w-full flex-col">
            <label
              htmlFor="review"
              className="text-lg font-semibold text-mygray-600"
            >
              Review
            </label>
            <textarea
              name="review"
              id="review"
              ref={textAreaRef}
              value={review}
              onChange={(e) => handleChange(e)}
              placeholder={movie.title}
              className="focus:border-1 focus:border-1 foc min-h-fitus:border-primary-400 border-1 min-h-fit
            resize-none overflow-hidden rounded-lg border-primary-300 bg-slate-100 p-2
            text-sm focus:border-primary-400 focus:no-underline focus:ring-1 focus:ring-primary-400"
            ></textarea>
          </div>

          <div className="mt-2 flex justify-between p-2">
            <button
              type="button"
              className="  rounded-lg bg-mygray-300 px-4 py-2 font-semibold uppercase text-mygray-500
            shadow-lg focus:border-0 focus:outline-none focus:ring-2 focus:ring-red-500/70
            "
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={isDisabled || creationLoading}
              className=" text-md rounded-lg  
             bg-primary-600 px-4 py-2 font-semibold uppercase text-mygray-50 shadow-lg 
             transition-all focus:outline-none
             focus:ring-4 disabled:bg-primary-400"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Routepage>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const movieId = context.params?.id as string;

  const movie = await getMovieByTitleId(movieId);
  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });

  console.log(session);
  if (!session || !session.user) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const existingReview = await getReviewByMovieIdAndUserId({
    movieId: movieId,
    userId: session.user.id,
  });

  if (existingReview) {
    return {
      redirect: {
        permanent: false,
        destination: `/movies/${movieId}/reviews/${existingReview.id}/edit`,
      },
    };
  }

  if (!movie) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      movie: serialize(movie),
    },
  };
};

const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string,
  minheight?: number
) => {
  useEffect(() => {
    if (textAreaRef) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.style.height = `${minheight ?? 0}px`;
      const scrollHeight = textAreaRef.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.style.height =
        minheight && scrollHeight < minheight
          ? `${minheight}px`
          : `${scrollHeight}px`;
    }
  }, [textAreaRef, value, minheight]);
};

export default Review;
