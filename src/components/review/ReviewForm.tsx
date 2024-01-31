import React, { useEffect, useRef, useState } from "react";
import type { ReviewFormProps as ReviewFormProps } from "../../app/movies/[id]/reviews/create/page";
import { useRouter } from "next/navigation";
import { backdroppathImagepath } from "../../server/utils/tmdb_api";
import { RankingListbox } from "../movierank/MovieRank";
import Image from "next/image";
import { createReviewAction, updateReviewAction } from "../../server/actions";
import { useFormState } from "react-dom";
import { FormSubmitButton } from "../button/Button";

type Props = {
  initialTitle: string;
  initialContent: string;
  initialRating: number;
  userId: string;
  movie: ReviewFormProps["movie"];
} & (
  | {
      mode: "create";
    }
  | { mode: "edit"; reviewId: string }
);
const ReviewForm = (props: Props) => {
  const { mode, initialContent, initialRating, initialTitle, movie, userId } =
    props;
  const reviewId = "reviewId" in props ? props.reviewId : null;
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const [rating, setRating] = useState<number>(initialRating);
  //const starArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const router = useRouter();

  useAutosizeTextArea(textAreaRef.current, content, 100);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const dependentAction =
    mode === "create" ? createReviewAction : updateReviewAction;
  const [state, dispatch] = useFormState(dependentAction, {
    message: "",
  });

  const getLongestSentence = (text: string) => {
    return text.split(".")[0];
  };

  const isDisabled = title.trim() === "" || content.trim() === "";

  const handleCancelClicked = () => {
    router.back();
  };

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
            src={backdroppathImagepath(movie.backdrop_path)}
            alt={`Image of${movie.title}`}
          />
        </div>
      </div>

      {/*<div className="flex-col-p-2-bg-mygray-300 flex">
                 <div className="grid grid-cols-5">
          {starArray.map((star) => (
            <StarIcon
              key={star}
              className={`h-6 w-6 ${
                star <= rating ? "text-yellow-500" : "text-mygray-500"
              } `}
              onClick={() => setRating(star)}
            ></StarIcon>
          ))}
        </div>
      </div>*/}

      <form
        className="mr-auto mt-4 w-full rounded bg-mygray-200 p-2 shadow"
        action={dispatch}
      >
        {reviewId != null && (
          <input type="hidden" name="reviewId" value={reviewId} />
        )}
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="movieId" value={movie.tmdb_id} />
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
            name="title"
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
          <RankingListbox selectedRank={rating} setSelectedRank={setRating} />
        </div>

        <div className="mt-2 flex w-full flex-col">
          <label
            htmlFor="content"
            className="text-lg font-semibold text-mygray-600"
          >
            Review
          </label>
          <textarea
            name="content"
            id="content"
            ref={textAreaRef}
            value={content}
            onChange={(e) => handleChange(e)}
            placeholder={movie.title}
            className="focus:border-1 focus:border-1 foc min-h-fitus:border-primary-400 border-1 min-h-fit
            resize-none overflow-hidden rounded-lg border-primary-300 bg-slate-100 p-2
            text-sm focus:border-primary-400 focus:no-underline focus:ring-1 focus:ring-primary-400"
          ></textarea>
        </div>

        <div className="mt-2 flex justify-between p-2">
          <button
            onClick={handleCancelClicked}
            type="button"
            className="rounded-lg bg-mygray-300 px-4 py-2 font-semibold uppercase text-mygray-500
            shadow-lg focus:border-0 focus:outline-none focus:ring-2 focus:ring-red-500/70
            "
          >
            Cancel
          </button>
          <FormSubmitButton
            disabled={isDisabled}
            className="text-md rounded-lg  
             bg-primary-600 px-4 py-2 font-semibold capitalize text-mygray-50 
             shadow-lg transition-all
             focus:outline-none focus:ring-4 disabled:bg-primary-400"
          >
            {mode}
          </FormSubmitButton>
          {state.message}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;

const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string,
  minheight?: number,
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
