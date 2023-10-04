import React from "react";

const Pagetitle = ({ title }: { title: string }) => {
  return (
    <h1 className=" mx-auto p-2 text-4xl font-semibold text-primary-600 ">
      {title}
    </h1>
  );
};

export default Pagetitle;
