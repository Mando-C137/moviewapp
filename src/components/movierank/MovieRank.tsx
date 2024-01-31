"use client";
import { Listbox, Transition } from "@headlessui/react";
import {
  TrashIcon,
  MinusCircleIcon,
  EyeIcon,
  FaceSmileIcon,
  StarIcon,
  TrophyIcon,
  HeartIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/solid";
import type { ReactElement } from "react";
import { Fragment } from "react";

type Rank = {
  name: string;
  rank: number;
  color: string;
  Symbol: ReactElement;
};

const myRanks: Rank[] = [
  {
    name: "Utter Trash",
    rank: 8,
    color: "text-amber-800",
    Symbol: (
      <TrashIcon className="h-6 w-6 text-amber-800 ring-2 ring-amber-800" />
    ),
  },
  {
    name: "Trash",
    rank: 7,
    color: "text-amber-600",
    Symbol: (
      <TrashIcon className="h-6 w-6 text-amber-600 ring-2 ring-amber-600" />
    ),
  },
  {
    name: "Neutral",
    rank: 6,
    color: "text-neutral-400",
    Symbol: (
      <MinusCircleIcon className="h-6 w-6  text-neutral-400 ring-2 ring-neutral-400" />
    ),
  },
  {
    name: "Watchable",
    rank: 5,
    color: "text-orange-500",
    Symbol: (
      <EyeIcon className="h-6 w-6 text-orange-500 ring-2 ring-orange-500" />
    ),
  },
  {
    name: "Recommend",
    rank: 4,
    color: "text-green-400",
    Symbol: (
      <FaceSmileIcon className="h-6 w-6  text-green-400 ring-2 ring-green-400" />
    ),
  },
  {
    name: "Contender",
    rank: 3,
    color: "text-yellow-500",
    Symbol: (
      <StarIcon className="h-6 w-6  text-yellow-500 ring-2 ring-yellow-500" />
    ),
  },
  {
    name: "Liste",
    rank: 2,
    color: "text-violet-600",
    Symbol: (
      <TrophyIcon className="h-6 w-6 text-violet-600  ring-2 ring-violet-600" />
    ),
  },
  {
    name: "Fav",
    rank: 1,
    color: "text-red-600",
    Symbol: <HeartIcon className="h-6 w-6  text-red-600 ring-2 ring-red-600" />,
  },
];

const RankingListbox = ({
  selectedRank,
  setSelectedRank,
}: {
  selectedRank: number;
  setSelectedRank: (val: number) => void;
}) => {
  const selectedRankItem = myRanks.find((item) => item.rank === selectedRank);

  return (
    <Fragment>
      <div className="w-72 ">
        <Listbox value={selectedRank} onChange={setSelectedRank} name="rating">
          <div className="relative mt-1 ">
            <Listbox.Button className=" relative flex w-full cursor-pointer rounded-lg border-2 border-primary-300 bg-white py-2 pl-2 pr-10 text-left  focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-300 sm:text-sm">
              {selectedRankItem && (
                <div className="flex w-full items-center space-x-4 p-2 text-base">
                  {selectedRankItem.Symbol}
                  <p className={`${selectedRankItem.color}`}>
                    {selectedRankItem.name}
                  </p>
                </div>
              )}

              {selectedRank == null && (
                <span
                  key={selectedRank}
                  className="block truncate  text-black text-opacity-40"
                >
                  Bitte auswählen
                </span>
              )}
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1  h-44 w-full overflow-scroll  rounded-md bg-white py-1 text-base ring-1 ring-black  ring-opacity-5 focus:outline-none sm:text-sm md:h-auto md:overflow-auto">
                {myRanks.map(({ Symbol, name, color, rank }) => (
                  <Listbox.Option
                    value={rank}
                    key={name}
                    className={({ selected, active }) =>
                      `${selected ? "font-bold" : ""} ${
                        active ? "bg-primary-50" : ""
                      }
                        flex w-full  cursor-pointer items-center space-x-4 p-2 pl-4 text-base`
                    }
                  >
                    {({ selected }) => (
                      <>
                        {Symbol}
                        <p className={`${color} ${selected ? "" : ""} `}>
                          {name}
                        </p>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </Fragment>
  );
};

const Ranking = ({ rank }: { rank: number }) => {
  const rankItem = myRanks.find((myRank) => myRank.rank === rank);
  if (!rankItem) return null;

  const { Symbol, color, name } = rankItem;
  return (
    <div className="flex w-full items-center space-x-4 text-base font-bold">
      {Symbol}
      <p className={color}>{name}</p>
    </div>
  );
};

export { RankingListbox, Ranking };
