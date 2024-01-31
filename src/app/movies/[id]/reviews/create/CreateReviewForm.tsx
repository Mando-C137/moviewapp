"use client";
import React from "react";
import type { ReviewFormProps } from "./page";
import ReviewForm from "../../../../../components/review/ReviewForm";

type Props = ReviewFormProps;
export default function CreateReviewForm({ movie, user }: Props) {
  return (
    <ReviewForm
      initialContent=""
      initialRating={5}
      initialTitle=""
      mode="create"
      movie={movie}
      userId={user.id}
    />
  );
}
