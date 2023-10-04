import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import React from "react";
import { getCollectionById } from "../../../server/utils/database/user";
import serialize from "../../../server/utils/database/serialize";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";
import * as TMDB_API from "../../../server/utils/tmdb_api";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { getServerAuthSession } from "../../../server/auth";
import Routepage from "../../../components/Route/Routepage";

const Index = ({
  collection,
  userIsOwner,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
                  <PencilSquareIcon className="ml-auto h-6 w-6 text-primary-400 hover:text-primary-600"></PencilSquareIcon>
                </Link>
              )}
            </div>
            <p className="font-bold text-mygray-700">
              created on {new Date(collection.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <p className="p-2 text-lg font-semibold">{collection.description}</p>

        <div className="grid grid-cols-3 gap-3 rounded-lg bg-mygray-100 p-4  shadow-md lg:grid-cols-4 lg:gap-5">
          {collection.movies.map((movie) => (
            <div key={movie.tmdb_id}>
              <div className="relative h-40 w-24 rounded-lg lg:m-4 lg:h-60 lg:w-36">
                <Image
                  fill
                  src={TMDB_API.posterpathImagepath(movie.poster_path)}
                  alt={`Image of ${movie.title}`}
                  className="absolute rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Routepage>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { collectionId } = ctx.query;
  const session = await getServerAuthSession({ ...ctx });
  const user = session?.user;

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
      userIsOwner: (user && user.id === collection.owner?.id) ?? false,
      collection: serialize(collection),
    },
  };
};

export default Index;
