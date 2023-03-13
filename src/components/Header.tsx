import { signIn, signOut, useSession } from "next-auth/react";

export const Header: React.FC = () => {
  const { data: session } = useSession();

  const isSignedIn = session?.user;

  return (
    <div className="sticky flex items-baseline justify-between p-2">
      <h3 className="text-2xl font-bold uppercase text-primary-700">
        <span className=" text-primary-600">mo</span>vi
        <span className=" text-primary-600">ew</span>
      </h3>
      <button
        className="btn-link btn text-xl font-semibold text-primary-600 underline"
        onClick={() => (isSignedIn ? void signOut() : void signIn())}
      >
        {isSignedIn ? `SignOut` : "SignIn"}
      </button>
    </div>
  );
};
