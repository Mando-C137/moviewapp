import { type NextPage } from "next";
import { signIn } from "next-auth/react";

import Pagewrapper from "../components/Pagewrapper/Pagewrapper";
import Routepage from "../components/Route/Routepage";

const features: { titel: string; desc: string }[] = [
  {
    titel: "View Imdb's Best Rated!",
    desc: "Moview tracks the movies listed in the official ImdB web site soyou know what is a must-see!",
  },
  {
    titel: "Keep a list of your watched movies",
    desc: "Save the movies you have watched and share your impressive collections!",
  },
  {
    titel: "Rate and Review movies",
    desc: "Not only tick and rate movies, but review them like a blog entry!",
  },
  {
    titel: "Keep an eye of what your fellas see and rate",
    desc: "See what others watch and rate, then educate them why they are wrong!",
  },
];

const Home: NextPage = () => {
  return (
    <Routepage name={"Moview"} action={{ type: "reset" }}>
      <Pagewrapper>
        <h1 className="inline-block bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 bg-clip-text py-2 text-center text-4xl font-bold text-transparent md:my-16">
          Your friendly neighbourhood movie platform
        </h1>

        <div className="mb-4 rounded-lg bg-slate-100 p-4 shadow-md">
          <p className="md:max-w-rxl text-center text-xl font-bold text-mygray-500">
            Your personal movie tickbox, rating list and review collection.
            Share your culture in film with friends and others.
          </p>
        </div>

        <button
          onClick={() => void signIn("google")}
          className="my-4 block rounded-xl bg-primary-600 px-4 py-4 font-bold text-white"
        >
          Get Started - completely free!
        </button>

        <p className="text-center text-xl font-bold text-primary-500">
          Moview satisfies all needs of a movie nerd:
        </p>

        <ul className="mx-auto grid grid-cols-1 items-center gap-4 text-primary-500 md:max-w-5xl md:grid-cols-2">
          {features.map((feature) => (
            <li
              key={feature.titel}
              className="flex flex-col gap-2 rounded-lg bg-mygray-100   bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 bg-clip-text p-4 py-2 font-bold shadow-sm"
            >
              <p className="text-center text-xl font-bold text-transparent">
                {feature.titel}
              </p>
              <p className="p-1 text-lg leading-6 text-transparent">
                {feature.desc}
              </p>
            </li>
          ))}
        </ul>
      </Pagewrapper>
    </Routepage>
  );
};

export default Home;
