import { useEffect, useState } from 'react';

export default function Navbar() {
  // State to track the current theme
  const [theme, setTheme] = useState('dark');
  // State to control resume modal
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // Load theme from localStorage on component mount
  useEffect(() => {
    // Get saved theme or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Effect to manage body overflow when modal is open/closed
  useEffect(() => {
    if (resumeModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [resumeModalOpen]);

  // Handle theme toggle
  const handleThemeChange = (e) => {
    const newTheme = e.target.checked ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Open resume modal
  const openResumeModal = () => {
    setResumeModalOpen(true);
  };

  // Close resume modal
  const closeResumeModal = () => {
    setResumeModalOpen(false);
  };

  return (
    <>
      <nav className={`navbar border-2 border-black shadow-2xl flex justify-between items-center p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-primary-content'}`}>
        {/* Home Icon */}
        <button className={`btn ${theme === 'dark' ? 'btn-outline text-purple-300' : 'btn-accent btn-outline'} flex items-center text-xl`} onClick={() => window.location.href = '#'}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </button>
        
        {/* Navigation Links */}
        <div className="flex space-x-4 items-center">
          <a className={`btn btn-outline normal-case text-xl ${theme === 'dark' ? 'text-purple-300' : 'btn-secondary text-accent-100'}`} href="#about">About Me</a>
          <a className={`btn btn-outline normal-case text-xl ${theme === 'dark' ? 'text-purple-300' : 'btn-secondary text-accent-100'}`} href="#projects">Projects</a>
          <a className={`btn btn-outline normal-case text-xl ${theme === 'dark' ? 'text-purple-300' : 'btn-secondary text-accent-100'}`} href="#tutoring">Tutoring</a>
          <a className={`btn btn-outline normal-case text-xl ${theme === 'dark' ? 'text-purple-300' : 'btn-secondary text-accent-100'}`} href="#contact">Contact</a>
          
          {/* Resume Button */}
                <button 
                onClick={openResumeModal}
                className={`btn btn-outline normal-case text-xl ${theme === 'dark' ? ' text-purple-300' : 'bg-accent hover:bg-accent-focus text-white'} normal-case text-xl`}
                >
                Resume
                </button>

                <select value="Quick Actions" className="select text-purple-300 outline normal-case text-xl" 
                onChange={(e) => {
                if (e.target.value === 'resume') {
                  openResumeModal();
                }
                e.target.value = 'Quick Actions';
                }}>
                <option disabled={true}>Quick Actions</option>
                <option value="RecLetter1">Letter of Rec</option>
                <option value="vscode fork">VScode fork</option>
                <option value="resume">Resume</option> 
                </select>

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

      {/* Resume Modal */}
      {resumeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeResumeModal}
          ></div>

{/* Modal Content - Letter of recommendation #1*/}
<div className={`relative ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg w-11/12 max-w-4xl h-5/6 z-10 p-6 overflow-hidden flex flex-col`}></div>
  <div className="flex justify-between items-center mb-4">
    <div className='font-bold text-2xl'>Letter of Recommendation</div>
    <button
      onClick={closeResumeModal}
      className="btn btn-circle btn-sm"
    >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
             
          {/* Modal Content */}
          <div className={`relative ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg w-11/12 max-w-4xl h-5/6 z-10 p-6 overflow-hidden flex flex-col`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-2xl">My Resume</h3>
              <button 
                onClick={closeResumeModal}
                className="btn btn-circle btn-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Resume Content - Scrollable */}
            <div className="flex-grow overflow-auto">
              {/* Education Section */}
              <div className="mb-6">
                <h4 className="text-xl font-semibold mb-2">Education</h4>
                <div className="pl-4 border-l-2 border-primary">
                  <p className="font-medium">University Name</p>
                  <p>Bachelor of Science in Computer Science</p>
                  <p className="text-sm opacity-75">2018 - 2022</p>
                </div>
              </div>
              
              {/* Experience Section */}
              <div className="mb-6">
                <h4 className="text-xl font-semibold mb-2">Experience</h4>
                <div className="pl-4 border-l-2 border-primary mb-4">
                  <p className="font-medium">Software Developer at Tech Company</p>
                  <p>Developed and maintained web applications using React and Node.js</p>
                  <p className="text-sm opacity-75">Jan 2022 - Present</p>
                </div>
                <div className="pl-4 border-l-2 border-primary">
                  <p className="font-medium">Frontend Intern at Startup</p>
                  <p>Built responsive UI components and implemented new features</p>
                  <p className="text-sm opacity-75">May 2021 - Dec 2021</p>
                </div>
              </div>
              
              {/* Skills Section */}
              <div className="mb-6">
                <h4 className="text-xl font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2 pl-4">
                  <span className="badge badge-primary">JavaScript</span>
                  <span className="badge badge-primary">React</span>
                  <span className="badge badge-primary">Node.js</span>
                  <span className="badge badge-primary">HTML/CSS</span>
                  <span className="badge badge-primary">Git</span>
                  <span className="badge badge-primary">Tailwind CSS</span>
                  <span className="badge badge-primary">MongoDB</span>
                </div>
              </div>
              
              {/* Projects Section */}
              <div className="mb-6">
                <h4 className="text-xl font-semibold mb-2">Projects</h4>
                <div className="pl-4 border-l-2 border-primary mb-4">
                  <p className="font-medium">Personal Portfolio Website</p>
                  <p>A responsive portfolio website built with React and Tailwind CSS</p>
                </div>
                <div className="pl-4 border-l-2 border-primary">
                  <p className="font-medium">E-commerce Platform</p>
                  <p>Full-stack application with user authentication and product management</p>
                </div>
              </div>
            </div>
            
            {/* Download Button */}
            <div className="mt-4 flex justify-center">
              <button className="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}