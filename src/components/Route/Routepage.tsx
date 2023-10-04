import React from "react";
import Head from "next/head";
import { useRegisterTreeData, type UpdateDetails } from "../../store/NavStore";

type Props = React.PropsWithChildren<{
  name: string;
  action: UpdateDetails;
}>;

const Routepage = ({ name, children, action }: Props) => {
  useRegisterTreeData(action);

  return (
    <div className="flex-grow">
      <Head>
        <title>{name}</title>
        <meta name="description" content={name} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </div>
  );
};

export default Routepage;
