export const Footer: React.FC = () => {
  return (
    <footer className="mt-4 border-t  border-t-mygray-100 pb-16 pt-4">
      <div className="grid grid-cols-2">
        <h4 className="px-4 py-2 text-lg uppercase text-primary-600">moview</h4>

        <div>
          <nav>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="./">Top250</a>
              </li>
              <li>
                <a href="./">Newest Movies</a>
              </li>
              <li>
                <a href="./">Top Reviewer</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};
