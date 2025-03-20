import { useEffect, useState } from 'react';

export default function Navbar() {
  // State to track the current theme
  const [theme, setTheme] = useState('light');
  // State to control which modal is open
  const [activeModal, setActiveModal] = useState(null);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Effect to manage body overflow when modal is open/closed
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeModal]);

  // Handle theme toggle
  const handleThemeChange = (e) => {
    const newTheme = e.target.checked ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
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
      <nav className={`navbar border-2 border-black shadow-2xl flex justify-between items-center p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-primary-content'}`}>
        <button className={`btn ${theme === 'dark' ? 'btn-outline text-purple-300' : 'btn-accent btn-outline'} flex items-center text-xl`} onClick={() => window.location.href = '#'}>
          Home
        </button>
        <div className="flex space-x-4 items-center">
          <a className={`btn btn-outline normal-case text-xl ${theme === 'dark' ? 'text-purple-300' : 'btn-secondary text-accent-100'}`} href="#about">About Me</a>
          <a className={`btn btn-outline normal-case text-xl ${theme === 'dark' ? 'text-purple-300' : 'btn-secondary text-accent-100'}`} href="#projects">Projects</a>
          <a className={`btn btn-outline normal-case text-xl ${theme === 'dark' ? 'text-purple-300' : 'btn-secondary text-accent-100'}`} href="#tutoring">Tutoring</a>
          <a className={`btn btn-outline normal-case text-xl ${theme === 'dark' ? 'text-purple-300' : 'btn-secondary text-accent-100'}`} href="#contact">Contact</a>
          <button onClick={() => openModal('resume')} className={`btn ${theme === 'dark' ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-accent hover:bg-accent-focus text-white'} normal-case text-xl`}>Resume</button>
          <select value="Quick Actions" className="select text-purple-300 outline normal-case text-xl" onChange={(e) => openModal(e.target.value)}>
            <option disabled>Quick Actions</option>
            <option value="RecLetter1">Letter of Rec</option>
            <option value="vscodeFork">VSCode Fork</option>
            <option value="resume">Resume</option>
          </select>

          {/* Theme Toggle */}
           {/* Theme Toggle Switch */}
           <label className="swap swap-rotate ml-2">
            <input 
              type="checkbox" 
              className="theme-controller" 
              checked={theme === 'dark'}
              onChange={handleThemeChange}
            />

            {/* Sun icon */}
            <svg
              color="#E5A600"
              className="swap-on h-10 w-10 fill-current btn-warning"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path
                d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* Moon icon */}
            <svg
              color="#ADB2D4"
              className="swap-off h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path
                d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
       
        </div>
      </nav>
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
          <div className={`relative ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg w-11/12 max-w-4xl h-5/6 z-10 p-6 overflow-hidden flex flex-col`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-2xl">{activeModal === 'resume' ? 'My Resume' : activeModal === 'RecLetter1' ? 'Letter of Recommendation' : 'VSCode Fork'}</h3>
              <button onClick={closeModal} className="btn btn-circle btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-grow overflow-auto">
              {activeModal === 'resume' && <p>Resume content goes here...</p>}
              {activeModal === 'RecLetter1' && <p>Letter of Recommendation content goes here...</p>}
              {activeModal === 'vscodeFork' && <p>VSCode Fork content goes here...</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
