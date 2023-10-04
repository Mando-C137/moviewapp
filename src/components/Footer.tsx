import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className=" mt-auto border-t border-t-mygray-100 pb-16 pt-4">
      <div className="grid grid-cols-2">
        <h4 className="px-4 py-2 text-lg uppercase text-primary-600">moview</h4>

        <div>
          <nav>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/movies">Top250</Link>
              </li>
              <li>
                <Link href="/movies">Movies</Link>
              </li>
              <li>
                <Link href="/reviewers">Reviewers</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};
