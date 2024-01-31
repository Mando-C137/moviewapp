import React from "react";
import { getCollectionById } from "../../../server/utils/database/user";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";
import * as TMDB_API from "../../../server/utils/tmdb_api";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Routepage from "../../../components/Route/Routepage";
import { notFound } from "next/navigation";
import { getServerSession } from "../../../server/auth";

export default async function CollectionPage({
  params: { collectionId },
}: {
  params: { collectionId: string };
}) {
  const { collection, userIsOwner } = await getServerdata(collectionId);
  return (
    <Routepage
      name={collection.title}
      action={{
        type: "collection",
        name: collection.title,
        href: `/collections/${collection.id}`,
        reviewer: {
          href: `/reviewers/${collection.owner?.id ?? "auto"}`,
          name: collection.owner?.name ?? "no reviewer",
        },
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 p-2">
        <div className="mt-4 flex w-full flex-row ">
          <div className="flex flex-grow flex-col items-start p-2 align-baseline">
            <div className=" flex flex-row items-center justify-center gap-2">
              <UserCircleIcon className="h-6 w-6 text-mygray-600"></UserCircleIcon>

              <Link
                href={`/reviewers/${collection.owner?.id ?? ""}`}
                className=" flex flex-grow "
              >
                <h3 className="text-mygray-600">
                  {collection.owner?.name ?? "no name"}
                </h3>
              </Link>
            </div>
            <div className="mt-2 flex w-full flex-row">
              <p className=" flex-grow text-xl font-bold tracking-tight text-mygray-800">
                {collection.title}
              </p>
              {userIsOwner && (
                <Link href={`/collections/${collection.id}/edit`}>
                  <PencilSquareIcon className="ml-auto h-6 w-6 text-primary-400 hover:text-primary-600" />
                </Link>
              )}
            </div>
            <p className="font-bold text-mygray-700">
              created on {collection.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        <p className="p-2 text-lg font-semibold">{collection.description}</p>

        <div className="grid grid-cols-3 gap-3 rounded-lg bg-mygray-100 p-4  shadow-md lg:grid-cols-4 lg:gap-5">
          {collection.movies.map((movie) => (
            <div key={movie.movie.tmdb_id}>
              <div className="relative h-40 w-24 rounded-lg lg:m-4 lg:h-60 lg:w-36">
                <Image
                  fill
                  src={TMDB_API.posterpathImagepath(movie.movie.poster_path)}
                  alt={`Image of ${movie.movie.title}`}
                  className="absolute rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Routepage>
  );
}

const getServerdata = async (collectionId: string) => {
  const session = await getServerSession();
  const user = session?.user;

  const collection = await getCollectionById(collectionId);
  if (collection === "error") {
    notFound();
  }

  return {
    userIsOwner: (user && user.id === collection.owner?.id) ?? false,
    collection: collection,
  };
};
