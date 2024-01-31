"use client";
import { useEffect } from "react";
import { create } from "zustand";

type TreeElement = { name: string; href: string } | null;
type NavTree = {
  reviewer: TreeElement;
  movie: TreeElement;
  review: TreeElement;
  collection: TreeElement;
};
type updateMovie = {
  type: "movie";
  name: string;
  href: string;
};
type updateReviewer = {
  type: "reviewer";
  name: string;
  href: string;
};
type updateCollection = {
  type: "collection";
  name: string;
  href: string;
  reviewer: { name: string; href: string };
};
type updateReview = {
  name: string;
  href: string;
  type: "review";
  movie: { href: string; name: string };
  reviewer: { name: string; href: string };
};
type updateReset = { type: "reset" };

export type UpdateDetails =
  | updateMovie
  | updateCollection
  | updateReview
  | updateReset
  | updateReviewer;

const useNavStore = create<{
  tree: NavTree;
  registerMovie: (movie: updateMovie) => void;
  registerCollection: (collection: updateCollection) => void;
  registerReview: (review: updateReview) => void;
  registerReviewer: (reviewer: updateReviewer) => void;
  reset: (reset: updateReset) => void;
  update: (args: UpdateDetails) => void;
}>((set, get) => ({
  tree: { reviewer: null, collection: null, movie: null, review: null },
  registerMovie: (movie) =>
    set({
      tree: {
        collection: null,
        movie: { ...movie },
        review: null,
        reviewer: null,
      },
    }),
  registerCollection: (collection) =>
    set({
      tree: {
        collection: { ...collection },
        movie: null,
        review: null,
        reviewer: { ...collection.reviewer },
      },
    }),

  registerReview: (review) =>
    set({
      tree: {
        review: { ...review },
        movie: { ...review.movie },
        collection: null,
        reviewer: { ...review.reviewer },
      },
    }),
  registerReviewer: (reviewer) =>
    set({
      tree: {
        collection: null,
        movie: null,
        review: null,
        reviewer: { ...reviewer },
      },
    }),
  reset: () =>
    set({
      tree: { collection: null, movie: null, review: null, reviewer: null },
    }),
  update: (args) => {
    switch (args.type) {
      case "collection":
        return get().registerCollection(args);
      case "review":
        return get().registerReview(args);
      case "movie":
        return get().registerMovie(args);
      case "reset":
        return get().reset(args);
      case "reviewer":
        return get().registerReviewer(args);
    }
  },
}));

export const useRegisterTreeData = (data: UpdateDetails) => {
  const udpateFn = useNavStore((state) => state.update);
  useEffect(() => {
    udpateFn(data);
  }, [data, udpateFn]);
};

export default useNavStore;
