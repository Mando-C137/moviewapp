import React from "react";
import Routepage from "../components/Route/Routepage";

const Errorpage = () => {
  return (
    <Routepage
      name="Moview - Not Found"
      action={{
        type: "reset",
      }}
    >
      <div>The page you are looking for could not be found</div>
    </Routepage>
  );
};

export default Errorpage;
