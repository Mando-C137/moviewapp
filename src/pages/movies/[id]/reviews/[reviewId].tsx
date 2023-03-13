import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import React from "react";
import { prisma } from "../../../../server/db";
import {
  serializeMovie,
  serializeReview,
} from "../../../../server/utils/database/serialize";

const Review = ({
  review,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="flex flex-col items-center p-2">
      <h1 className="text-center text-xl font-bold text-primary-600">
        {review.title}
      </h1>
      <div className="mt-6 max-w-full">
        <p>Review by {review.reviewer.name}</p>
        <div className=" rounded-lg bg-mygray-600">
          <p className=" w-full break-words px-4 py-2 text-justify text-primary-200 drop-shadow-lg">
            {review.content}
          </p>
        </div>
      </div>
      <div>{review.rating} out of 5</div>
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { reviewId } = context.query;

  const review = await prisma.review.findUnique({
    where: { id: reviewId as string },
    include: { movie: true, reviewer: true },
  });

  return review
    ? {
        props: {
          review: {
            ...serializeReview(review),
            reviewer: review.reviewer,
            movie: serializeMovie(review.movie),
          },
        },
      }
    : { notFound: true };
};

export default Review;
