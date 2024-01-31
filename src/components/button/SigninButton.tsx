"use client";

import React from "react";
import Button from "./Button";
import { signIn } from "next-auth/react";

export default function SigninButton() {
  return (
    <Button
      onClick={() => void signIn("google")}
      className="my-4 block rounded-xl bg-primary-600 px-4 py-4 font-bold text-white"
    >
      Get Started - completely free!
    </Button>
  );
}
