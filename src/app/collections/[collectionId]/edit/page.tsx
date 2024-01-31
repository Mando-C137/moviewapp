import React from "react";
import { getServerSession } from "../../../../server/auth";
import { getCollectionById } from "../../../../server/utils/database/user";
import Routepage from "../../../../components/Route/Routepage";
import { RedirectType, notFound, redirect } from "next/navigation";
import EditCollectionForm from "./EditCollectionForm";

export default async function EditCollectionPage({
  params: { collectionId },
}: {
  params: { collectionId: string };
}) {
  const collection = await getServerdata(collectionId);
  //tmdbIds

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
        <EditCollectionForm collection={collection} />
      </div>
    </Routepage>
  );
}

const getServerdata = async (collectionId: string) => {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/", RedirectType.replace);
  }

  const collection = await getCollectionById(collectionId);
  if (collection === "error") {
    notFound();
  }

  return collection;
};

export type EditCollectionProps = Awaited<ReturnType<typeof getServerdata>>;
