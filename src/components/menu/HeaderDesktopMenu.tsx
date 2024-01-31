"use client";
import type { PropsWithChildren } from "react";
import React from "react";
import useNavStore from "../../store/NavStore";
import {
  UserIcon,
  UsersIcon,
  HomeIcon,
  PlayIcon,
  MagnifyingGlassIcon,
  RectangleStackIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { signOut, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "../button/Button";

const HeaderDesktopMenu = () => {
  const { data: session } = useSession();
  const isSignedIn = session?.user != null;

  const treeData = useNavStore((state) => state.tree);
  const movie = treeData.movie ? (
    <DesktopMenuItem {...treeData.movie} Icon={PlusCircleIcon} />
  ) : null;
  const review = treeData.review ? (
    <DesktopMenuItem {...treeData.review} Icon={PlusCircleIcon} />
  ) : null;
  const reviewer = treeData.reviewer ? (
    <DesktopMenuItem {...treeData.reviewer} Icon={PlusCircleIcon} />
  ) : null;
  const collection = treeData.collection ? (
    <DesktopMenuItem {...treeData.collection} Icon={PlusCircleIcon} />
  ) : null;

  return (
    <nav className="mt-2 hidden text-left md:block">
      <div className=" flex w-56 flex-col  rounded-md bg-white  ring-1 ring-black ring-opacity-5 focus-visible:outline-none">
        <div>
          <Button
            onClick={() => {
              isSignedIn ? void signOut() : void signIn("google");
            }}
            className="group flex w-full items-center rounded-md bg-white   p-2 text-sm font-normal text-gray-900 focus-visible:bg-primary-500 focus-visible:text-white"
          >
            <UserIcon
              className="mr-2 h-5 w-5 text-mygray-600"
              aria-hidden="true"
            />
            {isSignedIn ? "Sign out" : "Sign in"}
          </Button>
        </div>
        <DesktopMenuItem
          name="Account"
          href={`/reviewers/${session?.user.id ?? ""}`}
          Icon={UsersIcon}
        />
        <DesktopMenuItem name="Home" href="/" Icon={HomeIcon} />
        <DesktopMenuItem href="/movies" name="Movies" Icon={PlayIcon}>
          {movie}
        </DesktopMenuItem>
        <DesktopMenuItem href="/reviewers" name="Reviewers" Icon={UsersIcon}>
          {reviewer}
        </DesktopMenuItem>
        <DesktopMenuItem href="/reviews" name="Reviews" Icon={UsersIcon}>
          {review}
        </DesktopMenuItem>
        <DesktopMenuItem
          href="/collections"
          name="Collections"
          Icon={RectangleStackIcon}
        >
          {collection}
        </DesktopMenuItem>
        <DesktopMenuItem
          href={"/movies/search"}
          name="Search"
          Icon={MagnifyingGlassIcon}
        ></DesktopMenuItem>
      </div>
    </nav>
  );
};

type DesktopMenuItemProps = PropsWithChildren<{
  href: string;
  name: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}>;

const DesktopMenuItem = ({
  href,
  Icon,
  name,
  children,
}: DesktopMenuItemProps) => {
  const path = usePathname();
  return (
    <>
      <Link
        href={href}
        className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-primary-500 hover:text-white focus-visible:bg-primary-500 focus-visible:text-white "
      >
        <Icon
          className={`h-5 w-5 shrink-0 ${path === href ? "text-primary-500" : "text-mygray-600"} `}
          aria-hidden="true"
        />
        {name}
      </Link>

      {children && <div className="pl-2">{children}</div>}
    </>
  );
};

export default HeaderDesktopMenu;
