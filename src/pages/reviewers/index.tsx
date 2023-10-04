import type { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import Image from "next/image";
import React, { Fragment } from "react";
import { prisma } from "../../server/db";
import Pagetitle from "../../components/Pagetitle/Pagetitle";
import Pagewrapper from "../../components/Pagewrapper/Pagewrapper";
import Routepage from "../../components/Route/Routepage";

const ReviewersRoute = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Routepage name="Moview - Reviewers" action={{ type: "reset" }}>
      <Pagewrapper>
        <Pagetitle title="Reviewers"></Pagetitle>
        <div className="text-medium p-2">
          <p className="bg-mygray-100 py-2 px-8 text-lg font-medium text-mygray-500 shadow-sm ">
            View the most active reviewers based on recent activity and amount
            of reviews and collections!
          </p>
        </div>
        <ol className="mx-auto grid grid-cols-1 gap-2 md:flex md:justify-around">
          {data.users.map((user) => (
            <li key={user.id}>
              <Reviewercard reviewer={user} />
            </li>
          ))}
        </ol>
      </Pagewrapper>
    </Routepage>
  );
};

const Reviewercard = ({
  reviewer,
}: {
  reviewer: InferGetServerSidePropsType<
    typeof getServerSideProps
  >["data"]["users"][number];
}) => {
  return (
    <div className=" w-64 rounded-lg border-mygray-400 bg-white py-2 shadow-sm shadow-mygray-200 ">
      <div className="flex flex-col gap-4">
        {/* image */}
        <div className="mt-3 flex items-center justify-center rounded-full">
          {reviewer.image != null && (
            <div className="relative h-14 w-14 rounded-full">
              <Image
                src={reviewer.image}
                fill
                className="absolute rounded-full"
                alt={`Image of ${reviewer.name ?? "no user"}`}
              ></Image>
            </div>
          )}
        </div>

        {/* name*/}
        <Link href={`reviewers/${reviewer.id}`} className="group mx-auto">
          <p className="p-1 text-center text-xl font-medium  text-slate-600 group-hover:bg-gradient-to-r group-hover:from-primary-700 group-hover:to-violet-700  group-hover:bg-clip-text group-hover:text-transparent">
            {reviewer.name}
          </p>
        </Link>

        <div className="grid grid-cols-3 divide-x divide-mygray-200 p-1">
          <div className="flex flex-col items-center gap-1">
            <p className="text-lg font-semibold text-mygray-600">
              {reviewer._count.reviews}
            </p>
            <p className="text-sm text-mygray-500">Reviews</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-lg font-semibold text-mygray-600">
              {reviewer._count.favorites}
            </p>
            <p className="text-sm text-mygray-500">Favorites</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-lg font-semibold text-mygray-600">
              {reviewer._count.collections}
            </p>
            <p className="text-sm text-mygray-500">Collections</p>
          </div>
        </div>

        <div></div>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const users = await prisma.user.findMany({
    take: 20,
    orderBy: {
      reviews: { _count: "desc" },
    },
    select: {
      name: true,
      image: true,
      id: true,
      _count: { select: { collections: true, favorites: true, reviews: true } },
    },
  });

  return {
    props: {
      data: { users },
    },
  };
};

export default ReviewersRoute;
