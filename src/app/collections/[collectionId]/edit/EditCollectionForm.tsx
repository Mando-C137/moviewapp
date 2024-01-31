"use client";
import Image from "next/image";
import { Combobox } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import type { Collection } from "@prisma/client";
import axios from "axios";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect, Fragment } from "react";
import Button from "../../../../components/button/Button";
import type { CollectionPost } from "../../../../pages/api/collections";
import type { SearchResult } from "../../../../utils/types";
import type { EditCollectionProps } from "./page";
import * as TMDB_API from "../../../../server/utils/tmdb_api";
import Link from "../../../../components/link/Link";

export default function EditCollectionForm({
  collection,
}: {
  collection: EditCollectionProps;
}) {
  const initCollectedMovies: SearchResult[] = collection.movies
    .map((movie) => movie.movie)
    .map((movie) => ({
      id: movie.tmdb_id,
      backdrop_path: movie.backdrop_path,
      poster_path: movie.poster_path,
      release_date: movie.release_date.toISOString(),
      title: movie.title,
      popularity: 1,
    }));

  const [collectedMovies, setCollectedMovies] =
    useState<SearchResult[]>(initCollectedMovies);
  const [collectionTitle, setCollectionTitle] = useState(collection.title);
  const [collectionDescription, setCollectionDescription] = useState(
    collection.description,
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
        `/api/movies/search?${searchParams}`,
      );

      setSearchResults(searchRequest.data.results);
    }, 1000),
    [setSearchResults],
  );
  const router = useRouter();

  const isFormValid =
    collectionTitle !== collection.title ||
    collectionDescription !== collection.description ||
    collectedMovies.length != collection.movies.length ||
    collectedMovies.every(
      (movie) =>
        collection.movies.find(
          (oldMovie) => movie.id !== oldMovie.movie.tmdb_id,
        ) === undefined,
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
          router.push(`/reviewers/${collection.owner.id}`);
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
        body,
      );
      if (res.status === 200) {
        router.push(`/collections/${res.data.collection.id}`);
      }
    } catch (e) {
      console.log(e);
    }

    //do create Collection
  };
  return (
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
              <li key={movie.id} className="rounded-full bg-mygray-300 px-1">
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
                      : [...movies, e],
                  );
            }}
          >
            <Combobox.Input
              className="text-md rounded-full  border-none bg-mygray-100 px-5 py-1  font-semibold text-mygray-500 ring-2
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
                                result.poster_path,
                              )}
                              alt="image"
                              placeholder="empty"
                              className="object-cover"
                            />
                          </div>
                          <div className="mr-auto flex flex-col text-xs ">
                            <h2 className="text-mygray-700">{result.title}</h2>
                            {result.release_date && (
                              <p className="text-mygray-500">
                                {new Date(result.release_date).getFullYear()}
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
        <Link variant={"outline"} href={`/collections/${collection.id}`}>
          Cancel
        </Link>
        <Button onClick={void deleteCollection} variant={"outline"}>
          Delete
        </Button>
        <Button type="submit" disabled={!isFormValid}>
          Save
        </Button>
      </div>
    </form>
  );
}
