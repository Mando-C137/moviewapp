"use client";
import React from "react";
import type { UpdateReviewFormProps } from "./page";
import ReviewForm from "../../../../../../components/review/ReviewForm";

export default function UpdateReviewForm({
  movie,
  review,
  user,
}: UpdateReviewFormProps) {
  return (
    <ReviewForm
      initialContent={review.content ?? ""}
      initialRating={review.rating}
      initialTitle={review.title}
      mode="edit"
      movie={movie}
      reviewId={review.id}
      userId={user.id}
    />
  );
}
