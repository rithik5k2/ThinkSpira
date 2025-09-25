import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Nav1 from "./Nav1/Nav1";

const LayOut2 = () => {

  return (
    <div>
      <Nav1 style={{zIndex : "100"}}/>
      <div>
         {/* style={{filter : "blur(5px)"}} */}
      <Outlet/>
      </div>
    </div>
  );
};

export default LayOut2;