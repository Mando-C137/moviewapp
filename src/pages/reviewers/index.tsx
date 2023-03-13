import type { User } from "@prisma/client";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import React from "react";
import { prisma } from "../../server/db";

const ReviewersRoute = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>
      <ul>
        {data.users.map((user) => (
          <li key={user.id} className="btn-link btn">
            {user.name && (
              <Link href={`/reviewers/${encodeURIComponent(user.id)}`}>
                {user.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

type ServerSideProps = { users: User[] };

export const getServerSideProps: GetServerSideProps<{
  data: ServerSideProps;
}> = async () => {
  const users = await prisma.user.findMany();

  return {
    props: {
      data: { users },
    },
  };
};

export default ReviewersRoute;
