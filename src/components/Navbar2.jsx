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
      <div className="text-xl font-bold dark:text-white">My Website</div>
      <div className="hidden md:flex space-x-6">
        <a href="#" className="text-gray-900 dark:text-white hover:text-gray-500">Home</a>
        <a href="#" className="text-gray-900 dark:text-white hover:text-gray-500">About</a>
        <a href="#" className="text-gray-900 dark:text-white hover:text-gray-500">Services</a>
        <a href="#" className="text-gray-900 dark:text-white hover:text-gray-500">Contact</a>
      </div>
      <div className="flex items-center">
      
        <button onClick={toggleDarkMode} className="p-2">
          {darkMode ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-500" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
