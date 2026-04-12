import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

function MainLayout() {
  return (
    <>
      <Navbar user={null} />
      <Outlet />
      <Footer></Footer>
    </>
  );
}

export default MainLayout;