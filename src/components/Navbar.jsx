import { useEffect, useState } from "react";
import  "../App.css";
import "../css/styles.css";

export default function Navbar() {
  // State to track the current theme
  const [theme, setTheme] = useState("light");
  // State to control which modal is open
  const [activeModal, setActiveModal] = useState(null);

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
      <nav id="navbar"
        className={`navbar border-2 border-black shadow-2xl flex justify-between items-center p-4 ${
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
        <div className="flex space-x-4 items-center">
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
          <select id="selectButton"
            value="Quick Actions"
            className={`select btn btn-outline outline-1 text-primary normal-case text-xl ${
              theme === "dark"
                ? "text-purple-300 border-purple-300 outline-2"
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
      </nav>
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
          ></div>
          <div
            className={`relative ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-800"
            } rounded-lg w-11/12 max-w-4xl h-5/6 z-10 p-6 overflow-hidden flex flex-col`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-3xl">
                {(() => {
                  if (activeModal === "resume") return "Resume";
                  if (activeModal === "RecLetter1") return "Recommendation Letter #1";
                  return "Recommendation Letter #2";
                })()}
              </h3>
              <button onClick={closeModal} className="btn btn-circle btn-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-grow overflow-auto">
              {activeModal === "resume" && (
                <div className="flex-grow overflow-auto">
                  {activeModal === "resume" && (
                    <div className="p-4">
                      <h2 className="text-3xl font-bold mb-2">
                        Robert Stewart
                      </h2>
                      <p >
                        Council Bluffs, IA 51503 • (712) 576–0088 •
                        robert.stewart.m@outlook.com
                      </p>

                      <h3 className="text-xl font-semibold mt-4">
                        TECHNICAL KNOWLEDGE AND SKILLS
                      </h3>
                      <p>
                        <strong>Languages:</strong> JavaScript, Python, Java,
                        PHP
                      </p>
                      <p>
                        <strong>Frameworks and Libraries:</strong> Bootstrap,
                        Tailwind, jQuery, React, Django, Next.JS, React Router
                      </p>
                      <p>
                        <strong>Web Development:</strong> HTML, CSS, MERN,
                        XAMPP, WAMP
                      </p>
                      <p>
                        <strong>Database Management:</strong> MySQL, SQL Server
                      </p>
                      <p>
                        <strong>Version Control and DevOps:</strong> Git,
                        GitHub, Docker, Azure
                      </p>
                      <p>
                        <strong>Operating Systems and Network Security:</strong>{" "}
                        Linux, Windows, Mac OS, Linux Administration, Windows
                        Server Management, Network Security Protocols, Firewall
                        Management
                      </p>
                      <p>
                        <strong>Other Skills:</strong> Communication,
                        Problem-Solving, Collaboration, Adaptability, Time
                        Management
                      </p>

                      <h3 className="text-xl font-semibold mt-4">EDUCATION</h3>
                      <p>
                        <strong>
                          Bachelor of Science in Software Development
                        </strong>{" "}
                        | Bellevue University, Bellevue, NE | 01/2024 - 06/2025
                        | GPA: 3.65
                      </p>
                      <p>
                        <strong>
                          Associate Degree of Arts in Computer Science
                        </strong>{" "}
                        | Iowa Western Community College, Council Bluffs, IA |
                        01/2020 - 05/2022 | GPA: 3.52
                      </p>

                      <h3 className="text-xl font-semibold mt-4">AWARDS</h3>
                      <p>Darrel H. Gottsch Endowed Scholarship (08/2024)</p>
                      <p>DREAM Scholarship (11/2024)</p>

                      <h3 className="text-xl font-semibold mt-4">
                        PROFESSIONAL EXPERIENCE
                      </h3>
                      <p>
                        <strong>CIS Peer Tutor</strong> | Bellevue University,
                        Bellevue, NE | 01/2024 - Current
                      </p>
                      <ul className="list-disc pl-6">
                        <li>
                          Led 150+ tutoring sessions across 20+ courses,
                          enhancing student success rates.
                        </li>
                        <li>
                          Designed personalized assignments to improve academic
                          performance.
                        </li>
                        <li>
                          Guided 100+ students in test prep and lab
                          configurations.
                        </li>
                      </ul>

                      <p className="mt-2">
                        <strong>IT Support Specialist</strong> | Pierson
                        Wireless, Omaha, NE | 10/2022 - 11/2023
                      </p>
                      <ul className="list-disc pl-6">
                        <li>
                          Resolved support tickets, reducing downtime by 20%.
                        </li>
                        <li>
                          Improved security response times, minimizing data
                          loss.
                        </li>
                        <li>Created user guides, cutting help desk queries.</li>
                      </ul>

                      <p className="mt-2">
                        <strong>Web Developer</strong> | Pierson Wireless,
                        Omaha, NE | 10/2022 - 11/2023
                      </p>
                      <ul className="list-disc pl-6">
                        <li>
                          Developed full-stack projects in Agile, enhancing
                          UX/UI.
                        </li>
                        <li>
                          Debugged, tested, and refined software releases.
                        </li>
                        <li>
                          Collaborated with teams to improve project delivery.
                        </li>
                      </ul>
                      <p className="italic">
                        Note: Both IT Support and Web Developer roles were
                        performed concurrently.
                      </p>

                      <p className="mt-2">
                        <strong>CDL Driver</strong> | Forward Air Solutions,
                        Omaha, NE | 10/2013 - 05/2022
                      </p>
                      <ul className="list-disc pl-6">
                        <li>
                          Maintained a 98% on-time delivery rate across 6,000+
                          loads.
                        </li>
                        <li>Ensured 99% compliance with DOT regulations.</li>
                      </ul>

                      <h3 className="text-xl font-semibold mt-4">
                        PROFESSIONAL PROJECTS
                      </h3>
                      <p>
                        <strong>Web Form Application Project</strong>
                      </p>
                      <ul className="list-disc pl-6">
                        <li>
                          Developed responsive web forms using Bootstrap and
                          Tailwind.
                        </li>
                        <li>
                          Implemented AJAX for asynchronous data handling.
                        </li>
                        <li>Built a PHP backend with MySQL for storage.</li>
                      </ul>

                      <p className="mt-2">
                        <strong>Job Parts and Pricing Tool</strong>
                      </p>
                      <ul className="list-disc pl-6">
                        <li>
                          Designed a web-based tool integrating user data with
                          pricing catalogs.
                        </li>
                        <li>
                          Streamlined project management and decision-making.
                        </li>
                      </ul>

                      <p className="mt-2">
                        <strong>Support Ticket CRUD Application</strong>
                      </p>
                      <ul className="list-disc pl-6">
                        <li>Developed an IT support system using Laravel.</li>
                        <li>
                          Enabled users to create, update, and manage tickets.
                        </li>
                        <li>
                          Deployed on Azure with CI/CD using GitHub Actions.
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

{/* Recommendation Letter 1 Modal Text */}

              {activeModal === "RecLetter1" && (
                <div className="flex-grow overflow-auto">
                  {activeModal === "RecLetter1" && (
                    <div className="p-4">
                  
<div className="text-lg/12">
                      <p>To Whom It May Concern,</p>
</div>
<div className="text-lg/6">
                      <p>
                        I am pleased to offer my highest recommendation for
                        Robert Stewart, who has served as a Computer Information
                        Systems Peer Tutor at Bellevue University. During his
                        time in this role, Robert has consistently displayed
                        exceptional technical expertise, strong communication
                        skills, and a high level of professionalism.
                      </p>
                      <br/>

                      <p>
                        Robert’s deep knowledge of a wide range of technologies
                        and software tools allows him to effectively support
                        students across various subjects, from programming to
                        system troubleshooting. His ability to quickly learn and
                        adapt to new platforms ensures that he provides relevant
                        and timely assistance. Beyond his technical ability,
                        Robert excels in explaining complex concepts in a clear
                        and approachable way, tailoring his tutoring to meet the
                        individual needs of each student.
                      </p>
<br/>
                      <p>
                        His professionalism and commitment to helping
                        others succeed are evident in every interaction, making
                        him a highly valued and respected member of our tutoring
                        team. I am confident that Robert’s dedication,
                        expertise, and collaborative approach will make him an
                        asset to any organization he joins.
                      </p>
                      
                      <p>
                        If you have any questions or require additional
                        information, please do not hesitate to contact me at{" "}
                        <a
                          href="mailto:rdavis@bellevue.edu"
                          className="text-blue-500"
                        >
                          rdavis@bellevue.edu
                        </a>
                        .
                      </p>
                      
                      <p className="mt-4">Sincerely,</p>
                      <p>Rachael Davis</p>
                      <p>Tutor and Study Skills Program Manager</p>
                      <p>Bellevue University</p>
                    </div>
                    </div>
                  )}
                </div>
              )}

              {activeModal === "RecLetter2" && (
                <div className="flex-grow overflow-auto">
                  {activeModal === "RecLetter2" && (
                    <div className="p-4">
                    

                      <p className="text-lg/12">To Whom It May Concern,</p>
                     

                      <p className="text-lg/6">
                        This letter serves as a reference for Mr. Robert
                        Stewart. Mr. Stewart was a student of mine in the
                        Software Development (CSD) degree completion program
                        from January 2024 until March 2025. During that time,
                        Mr. Stewart completed all course work in a professional
                        manner, displayed a willingness to go above and beyond
                        stated requirements, was a responsible participant in
                        group projects, and consistently demonstrated
                        proficiency in communication skills.{" "}
                      </p>
                      <br/>
                      <p className="text-lg/6">
                        I believe Mr. Stewart will continue to perform to a high
                        standard and will quickly become an asset in any
                        position he chooses. If you have any questions, or need
                        further information, please do not hesitate to contact
                        me.{" "}
                      </p>
<br/>
<div className="text-lg/6">
                      <p>
                        Sue Sampson
                        <br />
                        Associate Professor
                        <br />
                        College of Science and Technology
                        <br />
                        <a
                          href="mailto:sue.sampson@bellevue.edu"
                          className="text-blue-500"
                        >
                          sue.sampson@bellevue.edu
                        </a>
                        .
                      </p>
                      </div>
                    
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
