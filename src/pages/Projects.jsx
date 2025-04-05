import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../css/styles.css";

const projects = [
    {
        id: 'project1',
        title: 'Web Form Application Project',
        summary: 'Developed a responsive web application to streamline job hazard analysis, improving project approval speed.',
        bullets: [
            'Built with Bootstrap/Tailwind for responsive UI.',
            'Implemented dynamic form handling using JavaScript and jQuery.',
            'Used AJAX for seamless server communication.',
            'Designed a PHP backend for data processing and storage.',
            'Integrated MySQL for efficient data management.'
        ]
    },
    {
        id: 'project2',
        title: 'Job Parts and Pricing Tool',
        summary: 'Designed a tool that integrates user-provided data with pricing catalogs, aiding project managers in decision-making.',
        bullets: [
            'Developed a web-based application for cost estimation.',
            'Expanded tool functionality beyond existing capabilities.',
            'Combined stored and new data for real-time analysis.'
        ]
    },
    {
        id: 'project3',
        title: 'Support Ticket CRUD Application',
        summary: 'Engineered an IT Support Ticket Management System to enhance IT team efficiency.',
        bullets: [
            'Built with Laravel framework for a structured backend.',
            'Enabled users to create, read, update, and delete tickets.',
            'Utilized MySQL for data storage and retrieval.',
            'Deployed with Azure and GitHub Actions for CI/CD automation.'
        ]
    },
    {
        id: 'project4',
        title: 'Capstone Project Web Application',
        summary: 'Made lead developer of capstone group project.',
        bullets: [
            'Used Django framework for the full stack development.',
            'Collaborated with a team to design and implement the project.',
            'Conducted user testing to gather feedback and improve functionality.',
            'Presented the project to stakeholders, highlighting key features.'
        ]
        
    }
];

const Modal = ({ isOpen, title, summary, bullets, onClose }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            <button 
                className="absolute inset-0 bg-black bg-opacity-50" 
                onClick={onClose} 
                tabIndex="0" 
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
            ></button>
            <div className="bg-base-100 rounded-lg w-11/12 max-w-3xl z-10 p-6 relative text-xl">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{summary}</p>
                <ul className="list-disc list-inside text-lg">
                    {bullets.map((bullet, index) => (
                        <li key={index}>{bullet}</li>
                    ))}
                </ul>
                <div className="modal-action mt-4">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default function Projects() {
    const [activeModal, setActiveModal] = useState(null);
    
    useEffect(() => {
        document.body.style.overflow = activeModal ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [activeModal]);

    return (
        <>
       
            <Navbar />
            <div className="container mx-auto px-4">
    <h1 className="text-center text-7xl font-medium mb-8 mt-10 pt-6">Projects</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10 justify-center max-w-6xl mx-auto p-8">
        {projects.map((project) => (
            <div 
                key={project.id} 
                className="card bg-gray-700 text-white shadow-lg rounded-lg flex flex-col justify-between h-[300px] p-6"
            >
                <h2 className="card-title text-3xl">{project.title}</h2>
                <p className="flex-grow">{project.summary}</p>
                <div className="card-actions flex justify-end">
                    <button 
                        className="btn btn-secondary" 
                        onClick={() => setActiveModal(project.id)}
                    >
                        View Details
                    </button>
                </div>
            </div>
        ))}
    </div>
</div>
{projects.map((project) => (
    <Modal
        key={project.id}
        isOpen={activeModal === project.id}
        title={project.title}
        summary={project.summary}
        bullets={project.bullets}
        onClose={() => setActiveModal(null)}
    />
))}
        </>
    );
}



           
        

