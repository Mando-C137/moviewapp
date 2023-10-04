import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

const cn = (...classnames: ClassValue[]) => {
  return twMerge(clsx(classnames));
};
export default cn;
