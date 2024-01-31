"use client";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { HTMLProps } from "react";
import React from "react";
import cn from "../../utils/cn";
import type { LinkProps } from "next/link";
import { default as NextLink } from "next/link";

const linkVariants = cva(
  "rounded-lg bg-primary-600 px-4 py-2 text-lg font-semibold text-mygray-50 shadow-sm transition-all focus:outline-none focus:ring-4 disabled:bg-primary-400",
  {
    variants: {
      variant: {
        primary: "text-primary-600",
        outline: "text-primary-600 bg-mygray-100 ring-2 ring-primary-500",
      },
    },
  },
);

type Props = LinkProps &
  Omit<HTMLProps<HTMLAnchorElement>, "ref"> &
  React.RefAttributes<HTMLAnchorElement> &
  VariantProps<typeof linkVariants>;

export default function Link({ children, className, variant, ...rest }: Props) {
  return (
    <NextLink className={cn(linkVariants({ className, variant }))} {...rest}>
      {children}
    </NextLink>
  );
}
