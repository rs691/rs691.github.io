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
          <select defaultValue="Quick Actions" className="select select-primary" onChange={(e) => openModal(e.target.value)}>
            <option disabled>Quick Actions</option>
            <option value="RecLetter1">Letter of Rec</option>
            <option value="vscodeFork">VSCode Fork</option>
            <option value="resume">Resume</option>
          </select>
          <label className="swap swap-rotate ml-2">
            <input type="checkbox" className="theme-controller" checked={theme === 'dark'} onChange={handleThemeChange} />
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
