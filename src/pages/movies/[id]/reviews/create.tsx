import { StarIcon } from "@heroicons/react/24/solid";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { getMovieByTmdbId } from "../../../../server/utils/database/movie";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { serializeMovie } from "../../../../server/utils/database/serialize";

type Props = {
  movie: ReturnType<typeof serializeMovie>;
};

const Review = ({
  movie,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

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
          rating: 4,
        }
      );

      setCreationLoading(false);
      await router.push(response.data.url);
      setCreationLoading(false);
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  return (
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
            src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
            alt={`Image of${movie.title}`}
          />
        </div>
      </div>

      <div className="flex-col-p-2-bg-mygray-300 flex">
        <div className="flex">
          <StarIcon className="h-6 w-6 text-yellow-400">asadf</StarIcon>
          <StarIcon className="h-6 w-6 text-yellow-400"></StarIcon>
          <StarIcon className="h-6 w-6"></StarIcon>
          <StarIcon className="h-6 w-6"></StarIcon>
          <StarIcon className="h-6 w-6"></StarIcon>
        </div>
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
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const movieId = +(context.params?.id as string);

  const movie = await getMovieByTmdbId(+movieId);

  if (!movie) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        movie: serializeMovie(movie),
      },
    };
  }
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
