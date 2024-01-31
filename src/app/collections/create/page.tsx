import React from "react";
import { RedirectType, redirect } from "next/navigation";
import Routepage from "../../../components/Route/Routepage";
import { getServerSession } from "../../../server/auth";
import CreateCollectionForm from "./CreateCollectionForm";

export default async function CreateCollectionPage() {
  const { user } = await getServerdata();
  //tmdbIds

  return (
    <Routepage
      name="Moview - New Collection"
      action={{
        type: "reviewer",
        name: user.name ?? "null user",
        href: `/reviewers/${user.id}`,
      }}
    >
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 ">
        <h2 className="text-xl font-bold text-primary-500 ">
          New movie collection
        </h2>
        <CreateCollectionForm userId={user.id} />
      </div>
    </Routepage>
  );
}

const getServerdata = async () => {
  const session = await getServerSession();

  if (!session || !session.user) {
    return redirect("/", RedirectType.replace);
  } else {
    return {
      user: session.user,
    };
  }
};
