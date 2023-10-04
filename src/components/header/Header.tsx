import Link from "next/link";
import HeaderMobileMenu from "../menu/HeaderMobileMenu";

export const Header: React.FC = () => {
  return (
    <div className="sticky z-50 flex items-center justify-between p-2">
      <Link href="/">
        <h3 className="text-2xl font-bold uppercase text-primary-700">
          <span className=" text-primary-600">mo</span>vi
          <span className=" text-primary-600">ew</span>
        </h3>
      </Link>

      <HeaderMobileMenu />
    </div>
  );
};
