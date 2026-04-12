import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { useEffect, useState } from "react";

function MainLayout() {
    const [theme, setTheme] = useState(() => {
      return localStorage.getItem('theme') || 'light';
    });
    useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }, [theme]);
  
    const toggleTheme = () => {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };
  return (
    <>
      <Navbar user={null} theme={theme} toggleTheme={toggleTheme}/>
      <Outlet />
      <Footer></Footer>
    </>
  );
}

export default MainLayout;