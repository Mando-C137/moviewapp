"use client"
import { Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { Fragment } from "react";

const HeaderMobileMenu = () => {
  const { data: session } = useSession();

  const isSignedIn = session?.user;
  return (
    <Menu as="div" className="relative inline-block text-left md:hidden">
      <div className="flex flex-col justify-around">
        <Menu.Button className="inline-flex w-full justify-center rounded-md text-sm font-medium text-white hover:bg-opacity-30 ">
          <Bars3Icon className="h-7 w-7 text-primary-500 " aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100 z-10"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0  mt-2 w-56 origin-top-right divide-y divide-primary-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    isSignedIn ? void signOut() : void signIn("google");
                  }}
                  className={`${
                    active ? "bg-primary-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <UserIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  {isSignedIn ? "Sign out" : "Sign in"}
                </button>
              )}
            </Menu.Item>
            <Menu.Item disabled={!session?.user}>
              {({ active, disabled }) => (
                <Link
                  href={`/reviewers/${session?.user.id ?? ""}`}
                  className={`${
                    disabled
                      ? "text-mywhite-400 "
                      : active
                      ? "bg-primary-500 text-white"
                      : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <UsersIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  Account
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="p-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/"
                  className={`${
                    active ? "bg-primary-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <HomeIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  Home
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/movies"
                  className={`${
                    active ? "bg-primary-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <PlayIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  Top Movies
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={"/reviewers"}
                  className={`${
                    active ? "bg-primary-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <UsersIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  Reviewers
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={"/movies/search"}
                  className={`${
                    active ? "bg-primary-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
                  Search
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default HeaderMobileMenu;
