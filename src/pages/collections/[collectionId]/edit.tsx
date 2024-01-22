import React, { Fragment, useCallback, useEffect, useState } from "react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Image from "next/image";
import debounce from "lodash.debounce";
import { Combobox } from "@headlessui/react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Collection } from "@prisma/client";
import { useRouter } from "next/router";
import type { SearchResult } from "../../../utils/types";
import type { CollectionPost } from "../../api/collections";
import { getServerAuthSession } from "../../../server/auth";
import { getCollectionById } from "../../../server/utils/database/user";
import serialize from "../../../server/utils/database/serialize";
import * as TMDB_API from "../../../server/utils/tmdb_api";
import Button from "../../../components/button/Button";
import Routepage from "../../../components/Route/Routepage";

const Index = ({
  collection,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  //tmdbIds
  const initCollectedMovies: SearchResult[] = collection.movies
    .map((movie) => movie.movie)
    .map((movie) => ({
      id: movie.tmdb_id,
      backdrop_path: movie.backdrop_path,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      title: movie.title,
      popularity: 1,
    }));

  const [collectedMovies, setCollectedMovies] =
    useState<SearchResult[]>(initCollectedMovies);
  const [collectionTitle, setCollectionTitle] = useState(collection.title);
  const [collectionDescription, setCollectionDescription] = useState(
    collection.description
  );

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedSearchResult, setSelectedSearchResult] =
    useState<SearchResult | null>(null);

  const debounceFn = useCallback(
    debounce(async (queryString: string) => {
      if (!queryString) {
        return;
      }
      const searchParams = new URLSearchParams({
        query: queryString,
      }).toString();
      const searchRequest = await axios.get<{ results: SearchResult[] }>(
        `/api/movies/search?${searchParams}`
      );

      setSearchResults(searchRequest.data.results);
    }, 1000),
    [setSearchResults]
  );
  const router = useRouter();

  const isFormValid =
    collectionTitle !== collection.title ||
    collectionDescription !== collection.description ||
    collectedMovies.length != collection.movies.length ||
    collectedMovies.every(
      (movie) =>
        collection.movies.find(
          (oldMovie) => movie.id !== oldMovie.movie.tmdb_id
        ) === undefined
    );
  // Stop the invocation of the debounced function
  // after unmounting
  useEffect(() => {
    return () => {
      debounceFn.cancel();
    };
  }, [debounceFn]);

  const onRemoveMovieFromCollection = (id: number) => {
    setCollectedMovies((movies) => movies.filter((movie) => movie.id !== id));
  };

  const deleteCollection = async () => {
    try {
      const req = await axios.delete(`/api/collections/${collection.id}`);
      if (req.status == 200) {
        if (collection.owner) {
          await router.push(`/reviewers/${collection.owner.id}`);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const createCollection = async () => {
    const body: CollectionPost = {
      title: collectionTitle,
      description: collectionDescription,
      movieIds: collectedMovies.map((movie) => movie.id),
    };

    try {
      const res = await axios.put<{ collection: Collection }>(
        `/api/collections/${collection.id}`,
        body
      );
      if (res.status === 200) {
        await router.push(`/collections/${res.data.collection.id}`);
      }
    } catch (e) {
      console.log(e);
    }

    //do create Collection
  };

  const goback = `/collections/${collection.id}`;

  return (
    <Routepage
      name={collection.title}
      action={{
        type: "collection",
        name: collection.title,
        href: `/collections/${collection.id}`,
        reviewer: {
          name: collection.owner?.name ?? "no user",
          href: `/reviewers/${collection.owner?.id ?? "error"}`,
        },
      }}
    >
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 ">
        <h2 className="text-xl font-bold text-primary-500 ">
          New movie collection
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void createCollection();
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <label htmlFor="name">Title</label>
              <input
                value={collectionTitle}
                onChange={(e) => setCollectionTitle(e.target.value)}
                type="text"
                name="name"
                id="name"
                className="focus:border-1 rounded-lg border-2 border-primary-300
            bg-slate-100 p-2 focus:border-primary-400 focus:no-underline focus:ring-1 focus:ring-primary-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description">Description</label>
              <input
                value={collectionDescription}
                onChange={(e) => setCollectionDescription(e.target.value)}
                type="text"
                name="description"
                id="despription"
                className="focus:border-1 rounded-lg border-2 border-primary-300
            bg-slate-100 p-2 focus:border-primary-400 focus:no-underline focus:ring-1 focus:ring-primary-400"
              />
            </div>
            <ul className="flex flex-row flex-wrap items-center gap-1 p-2">
              {collectedMovies.map((movie) => {
                return (
                  <li
                    key={movie.id}
                    className="rounded-full bg-mygray-300 px-1"
                  >
                    <div className="flex items-center text-sm text-mygray-500">
                      <p> {movie.title}</p>

                      <button
                        role="button"
                        onClick={() => onRemoveMovieFromCollection(movie.id)}
                      >
                        <XMarkIcon className="h-4 w-4 text-mygray-500" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <Combobox
                value={selectedSearchResult}
                onChange={(e) => {
                  setSelectedSearchResult(e),
                    e !== null &&
                      setCollectedMovies((movies) =>
                        movies.map((movie) => movie.id).includes(e.id)
                          ? movies
                          : [...movies, e]
                      );
                }}
              >
                <Combobox.Input
                  className="text-md rounded-full  border-none bg-mygray-100 py-1 px-5  font-semibold text-mygray-500 ring-2
          ring-mygray-400 focus:outline-none focus:ring-1
          focus:ring-primary-600 active:outline-none"
                  value={query}
                  onChange={(event) => {
                    const val = event.target.value;
                    setQuery(val);
                    void debounceFn(val);
                  }}
                />
                <Combobox.Options className=" grid max-h-[80vh] grid-cols-1 divide-y-2 divide-mygray-300 overflow-y-scroll  ">
                  {searchResults.map((result) => (
                    <Combobox.Option
                      key={result.id}
                      value={result}
                      as={Fragment}
                      disabled={collectedMovies
                        .map((movie) => movie.id)
                        .includes(result.id)}
                    >
                      {({ active, disabled }) => {
                        return (
                          <li
                            key={result.id}
                            className={` ${
                              active
                                ? "bg-primary-200"
                                : disabled
                                ? "bg-primary-50"
                                : "bg-mygray-100"
                            }`}
                          >
                            <div className="m-2 flex flex-row gap-2">
                              <div className="relative h-16 w-10">
                                <Image
                                  fill
                                  src={TMDB_API.posterpathImagepath(
                                    result.poster_path
                                  )}
                                  alt="image"
                                  placeholder="empty"
                                  className="object-cover"
                                />
                              </div>
                              <div className="mr-auto flex flex-col text-xs ">
                                <h2 className="text-mygray-700">
                                  {result.title}
                                </h2>
                                {result.release_date && (
                                  <p className="text-mygray-500">
                                    {new Date(
                                      result.release_date
                                    ).getFullYear()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      }}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Combobox>
            </div>
          </div>
          <div className="mt-2 flex  gap-2 p-2">
            <Button as="link" action={goback}>
              Cancel
            </Button>
            <Button as="button" action={() => void deleteCollection()}>
              Delete
            </Button>
            <button
              type="submit"
              disabled={!isFormValid}
              className=" rounded-lg bg-primary-600  
             px-4 py-2 text-lg font-semibold text-mygray-50 shadow-sm 
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

export const getServerSideProps = async ({
  req,
  res,
  query,
}: GetServerSidePropsContext) => {
  const session = await getServerAuthSession({ req, res });

  if (!session || !session.user) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const { collectionId } = query;
  if (typeof collectionId !== "string") {
    return {
      notFound: true,
    };
  }

  const collection = await getCollectionById(collectionId);
  if (collection === "error") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collection: serialize(collection),
    },
  };
};

export default Index;
