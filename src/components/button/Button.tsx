import { cva } from "class-variance-authority";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import React from "react";

type Props = (
  | { as: "button"; action: () => void }
  | { as: "link"; action: string }
) &
  ButtonHTMLAttributes<HTMLButtonElement>;

const buttonVariants = cva(
  "rounded-lg bg-primary-600 px-4 py-2 text-lg font-semibold text-mygray-50 shadow-sm transition-all focus:outline-none focus:ring-4 disabled:bg-primary-400",
  {
    variants: {
      variant: {
        primary: "text-primary-600",
        outline: "text-primary-400",
      },
    },
  }
);
buttonVariants({ variant: "primary" });

const Button = ({ as, action, children, ...rest }: Props) => {
  if (as === "button")
    return (
      <button
        type="button"
        onClick={action}
        className="rounded-lg bg-primary-600 px-4 py-2 text-lg font-semibold text-mygray-50 shadow-sm transition-all focus:outline-none focus:ring-4 disabled:bg-primary-400"
        {...rest}
      >
        {children}
      </button>
    );
  return (
    <Link href={action} passHref>
      <button
        type="button"
        role="link"
        className="rounded-lg bg-mygray-300 px-4 py-2 font-semibold uppercase text-mygray-500 shadow-lg focus:border-0 focus:outline-none focus:ring-2 focus:ring-red-500/70"
        {...rest}
      >
        {children}
      </button>
    </Link>
  );
};

export default Button;
