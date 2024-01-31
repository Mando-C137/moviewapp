"use client";
import React from "react";
import { useRegisterTreeData, type UpdateDetails } from "../../store/NavStore";

type Props = React.PropsWithChildren<{
  name: string;
  action: UpdateDetails;
}>;

const Routepage = ({ children, action }: Props) => {
  useRegisterTreeData(action);
  return <div className="flex-grow">{children}</div>;
};

export default Routepage;
