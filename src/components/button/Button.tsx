"use client";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import React from "react";
import cn from "../../utils/cn";
import { useFormStatus } from "react-dom";

const buttonVariants = cva(
  "rounded-lg bg-primary-600 px-4 py-2 text-lg font-semibold text-mygray-50 shadow-sm transition-all focus:outline-none focus:ring-4 disabled:bg-primary-400",
  {
    variants: {
      variant: {
        primary: "text-primary-600 ",
        outline: "text-primary-600 bg-mygray-100 ring-2 ring-primary-500",
      },
    },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = ({ children, className, variant, ...rest }: Props) => {
  return (
    <button className={cn(buttonVariants({ className, variant }))} {...rest}>
      {children}
    </button>
  );
};

export const FormSubmitButton = ({
  children,
  className,
  variant,
  disabled,
  ...rest
}: Omit<Props, "type">) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={cn(buttonVariants({ className, variant }))}
      disabled={pending || disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
