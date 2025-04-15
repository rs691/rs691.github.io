import { useEffect, useState } from "react";
import "../App.css";
import "../css/styles.css";

export default function Nav3() {
  // State to track the current theme
  const [theme, setTheme] = useState("light");
  // State to control which modal is open
  const [activeModal, setActiveModal] = useState(null);
  // State to control drawer open/close
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Effect to manage body overflow when modal is open/closed
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeModal]);

  // Handle theme toggle
  const handleThemeChange = (e) => {
    const newTheme = e.target.checked ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Open modal
  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  // Close modal
  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <nav 
        id="navbar"
        className={`navbar shadow-2xl flex justify-between items-center p-4 ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-white text-primary-content"
        }`}
      >
        <button 
          className={`btn ${
            theme === "dark"
              ? "btn-outline outline-1 text-purple-300"
              : "btn-primary btn-outline outline-1 outline-white"
          } flex items-center text-xl`}
          onClick={() => (window.location.href = "#")}
        >
          Home
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-4 items-center">
          <a
            className={`btn btn-outline outline-1 normal-case text-xl ${
              theme === "dark" ? "text-purple-300" : "btn-primary btn-outline outline-2"
            }`}
            href="#about"
          >
            About Me
          </a>
          <a
            className={`btn btn-outline outline-1 normal-case text-xl ${
              theme === "dark" ? "text-purple-300" : "btn-primary btn-outline outline-2"
            }`}
            href="#projects"
          >
            Projects
          </a>
          <a
            className={`btn btn-outline outline-1 normal-case text-xl ${
              theme === "dark" ? "text-purple-300" : "btn-primary btn-outline outline-2"
            }`}
            href="#tutoring"
          >
            Tutoring
          </a>
          <a
            className={`btn btn-outline outline-1 normal-case text-xl ${
              theme === "dark" ? "text-purple-300" : "btn-primary btn-outline outline-2"
            }`}
            href="#contact"
          >
            Contact
          </a>
          <select 
            id="selectButton"
            value="Quick Actions"
            className={`select btn btn-outline outline-1 text-primary normal-case text-xl ${
              theme === "dark"
                ? "text-purple-300 border-purple-300"
                : "btn-primary btn-outline"
            }`}
            onChange={(e) => openModal(e.target.value)}
          >
            <option disabled>Quick Actions</option>
            <option value="RecLetter1">Recommendations</option>
            <option value="RecLetter2">Recommendations</option>
            <option value="resume">Resume</option>
          </select>
          
          {/* Theme Toggle Switch */}
          <label className="swap swap-rotate ml-2">
            <input
              type="checkbox"
              className="theme-controller"
              checked={theme === "dark"}
              onChange={handleThemeChange}
            />
            {/* Sun icon */}
            <svg
              color="#E5A600"
              className="swap-on h-10 w-10 fill-current btn-warning"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            {/* Moon icon */}
            <svg
              color="#0C0950"
              className="swap-off h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button 
            className="btn btn-outline" 
            onClick={() => setIsDrawerOpen(true)}
          >
            Menu
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`drawer drawer-end ${isDrawerOpen ? "open" : ""}`}>
        <input 
          id="drawer-toggle" 
          type="checkbox" 
          className="drawer-toggle" 
          checked={isDrawerOpen} 
          onChange={() => setIsDrawerOpen(!isDrawerOpen)} 
        />
        <div className="drawer-content"></div>
        <div className="drawer-side">
          <label 
            htmlFor="drawer-toggle" 
            className="drawer-overlay" 
            onClick={() => setIsDrawerOpen(false)}
          ></label>
          <ul className="menu p-4 w-80 bg-base-200">
            <li><a href="#about" onClick={() => setIsDrawerOpen(false)}>About Me</a></li>
            <li><a href="#projects" onClick={() => setIsDrawerOpen(false)}>Projects</a></li>
            <li><a href="#tutoring" onClick={() => setIsDrawerOpen(false)}>Tutoring</a></li>
            <li><a href="#contact" onClick={() => setIsDrawerOpen(false)}>Contact</a></li>
            <li>
              <details>
                <summary>Quick Actions</summary>
                <ul>
                  <li><button onClick={() => { openModal("RecLetter1"); setIsDrawerOpen(false); }}>Recommendation Letter 1</button></li>
                  <li><button onClick={() => { openModal("RecLetter2"); setIsDrawerOpen(false); }}>Recommendation Letter 2</button></li>
                  <li><button onClick={() => { openModal("resume"); setIsDrawerOpen(false); }}>Resume</button></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>

      {/* Existing Modal Code Remains the Same */}
      {activeModal && (
        <div className="modal">
          <div className="modal-box">
            <h2>{activeModal}</h2>
            <button className="btn btn-primary" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}