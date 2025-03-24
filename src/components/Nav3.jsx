
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);
 

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };



  return (
    <nav className="bg-gray-100 dark:bg-gray-900 shadow p-4 flex justify-between items-center">
  
    
      
      
     
  
        <div className="drawer z-50">
        <input id="menu-toggle" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Navbar */}
          <nav className="navbar bg-black text-primary-content flex justify-between items-center p-4">
            {/* Menu Button for Small Screens */}
            <label htmlFor="menu-toggle" className="btn btn-primary lg:hidden">
              ☰
            </label>
  
            {/* Home Icon */}
            <a className="btn btn-accent btn-outline flex items-center text-xl" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </a>
  
            {/* Navigation Links (Hidden on Small Screens) */}
            <div className="hidden lg:flex space-x-4">
              <a className="btn btn-secondary btn-outline text-accent normal-case text-xl" href="#about">
                About Me
              </a>
              <a className="btn btn-secondary btn-outline text-accent normal-case text-xl" href="#projects">
                Projects
              </a>
              <a className="btn btn-secondary btn-outline text-accent normal-case text-xl" href="#tutoring">
                Tutoring
              </a>
              <a className="btn btn-secondary btn-outline text-accent normal-case text-xl" href="#contact">
                Contact
              </a>
              <a className="btn btn-primary btn-outline text-accent normal-case text-xl" href="#blog">
                Blog
              </a>
              <a className="btn btn-primary btn-outline text-accent normal-case text-xl" href="#services">
                Services
              </a>
            </div>
  
            {/* Theme Toggle */}
            <label className="swap swap-rotate">
              <input type="checkbox" className="theme-controller" value="light" />
      

              <button onClick={toggleDarkMode} className="p-2">
          {darkMode ? <Sun className="text-yellow-500" /> : <Moon className="text-white" />}
        </button>
            </label>
          </nav>
        </div>
      </div>
      </nav>
  );
};

export default Navbar;


