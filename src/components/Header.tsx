export const Header: React.FC = () => {
  return (
    <div className="sticky mt-2 flex items-baseline justify-between p-2">
      <h3 className="text-2xl font-bold uppercase text-primary-700">
        <span className=" text-primary-600">mo</span>vi
        <span className=" text-primary-600">ew</span>
      </h3>
      <a className="text-xl font-semibold text-primary-600 underline">
        Register
      </a>
    </div>
  );
};
