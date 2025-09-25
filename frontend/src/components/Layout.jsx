import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Nav from "./Nav/Nav";

const Layout = () => {

  return (
    <div>
      <Nav style={{zIndex : "100"}}/>
      <div>
         {/* style={{filter : "blur(5px)"}} */}
      <Outlet/>
      </div>
    </div>
  );
};

export default Layout;