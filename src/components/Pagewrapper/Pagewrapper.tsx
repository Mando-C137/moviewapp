import type { PropsWithChildren } from "react";
import React from "react";

const Pagewrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="max-w-8xl mx-auto flex min-w-fit flex-col items-center justify-center gap-6">
      {children}
    </div>
  );
};

export default Pagewrapper;
