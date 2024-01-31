"use client";
import axios from "axios";
import React, { useState, useEffect, useCallback, Fragment } from "react";
import Image from "next/image";
import { Combobox } from "@headlessui/react";
import debounce from "lodash.debounce";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Routepage from "../../../components/Route/Routepage";
import { movieTitleToId } from "../../../utils/helpers";
import type { SearchResult } from "../../../utils/types";
import * as TMDB_API from "../../../server/utils/tmdb_api";

export default function SearchMoviePage() {
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

  // Stop the invocation of the debounced function
  // after unmounting
  useEffect(() => {
    return () => {
      debounceFn.cancel();
    };
  }, [debounceFn]);

  return (
    <Routepage name="Moview Search" action={{ type: "reset" }}>
      <div className="flex w-full flex-col items-center gap-2 md:mx-auto md:max-w-3xl">
        <h2 className="text-2xl font-bold text-primary-600">Search A Movie</h2>

        <Combobox
          value={selectedSearchResult}
          onChange={setSelectedSearchResult}
        >
          <div className="relative w-full">
            <Combobox.Input
              as="input"
              className="text-md relative w-full  overflow-hidden rounded-full border-none bg-mygray-100  py-1 pl-5 pr-10 font-semibold text-mygray-500
          ring-2 ring-mygray-400 focus:outline-none focus:ring-1
          focus:ring-primary-600 active:outline-none"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                void debounceFn(event.target.value);
              }}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <MagnifyingGlassIcon className="h-6 w-6 origin-bottom-right text-mygray-400" />
            </Combobox.Button>
          </div>
          <Combobox.Options className=" mt-2 grid max-h-[80vh] w-full grid-cols-1 divide-y-2 divide-mygray-300 overflow-y-scroll  rounded-md">
            {searchResults.map((result) => (
              // hier ist ein Suchergebnis
              <Combobox.Option key={result.id} value={result} as={Fragment}>
                {({ active }) => (
                  <li
                    key={result.id}
                    className={`${
                      active ? "bg-primary-200" : "bg-mygray-100"
                    } `}
                  >
                    <Link
                      href={`/movies/${movieTitleToId(
                        result.title,
                        new Date(result.release_date).getFullYear(),
                      )}`}
                      className="flex flex-row"
                    >
                      <div className="relative h-16 w-10">
                        <Image
                          fill
                          src={TMDB_API.posterpathImagepath(result.poster_path)}
                          alt="image"
                          className="object-contain"
                        />
                      </div>
                      <div className="mr-auto flex flex-col p-2 text-sm">
                        <h2 className="text-mygray-700">{result.title}</h2>
                        {result.release_date && (
                          <p className="text-mygray-500">
                            {new Date(result.release_date).getFullYear()}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </div>
    </Routepage>
  );
}
