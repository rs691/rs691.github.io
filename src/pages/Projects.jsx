import { useState, useEffect } from "react";
import Navbar2 from "../components/Navbar";
import PropTypes from 'prop-types';


export default function Projects() {
    // State to track which modal is currently active (null means no modal is open)
    const [activeModal, setActiveModal] = useState(null);
    
    // Effect to manage body overflow when modal is open/closed
    useEffect(() => {
        // If a modal is active, prevent body scrolling
        if (activeModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        // Cleanup function to ensure scrolling is re-enabled
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [activeModal]);

    // Function to open a specific modal
    const openModal = (modalId) => {
        setActiveModal(modalId);
    };
    
    // Function to close the active modal
    const closeModal = () => {
        setActiveModal(null);
    };

    // Data for projects to make the code more maintainable
    const projects = [
        {
            id: 'project1',
            title: 'Project 1',
            description: 'Job Hazard Assessment Tool',
            details: 'Developed a full-stack web application for project management and installation teams to assess job site safety. The form was integrated alongside other estimate tools, warehouse inventory, and pricing catalogs. The tool was designed to be user-friendly and mobile-responsive for on-site use. The project was developed using Bootstrap, jQuery, JavaScript, PHP, and MySQL.'
        },
        {
            id: 'project2',
            title: 'Project 2',
            description: 'Description of Project 2',
            details: 'This is the detailed content for Project 2. You can add more information, technologies used, features, etc.'
        },
        {
            id: 'project3',
            title: 'Project 3',
            description: 'Description of Project 3',
            details: 'This is the detailed content for Project 3. You can add more information, technologies used, features, etc.'
        }
    ];

    // Modal component to avoid repetition
   

    const Modal = ({ isOpen, title, content, onClose }) => {
        Modal.propTypes = {
            isOpen: PropTypes.bool.isRequired,
            title: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            onClose: PropTypes.func.isRequired,
        };
    
        if (!isOpen) return null;
        
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
                {/* Backdrop with click handler to close */}
                <div 
                    className="absolute inset-0 bg-black bg-opacity-50"
                    onClick={onClose}
                ></div>
                
                {/* Modal content */}
                <div className="bg-base-100 rounded-lg w-11/12 max-w-3xl z-10 p-6 relative text-xl">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="py-4">{content}</p>
                    <div className="modal-action">
                        <button className="btn" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="overflow-x-hidden min-h-3/4">
            <Navbar2 />
            <div className="container mx-auto px-4">
                <h1 className=" px-4 text-center text-7xl font-medium mb-8 mt-10 pt-8">Projects</h1>
                
                {/* Project Cards */}
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto justify-center max-w-6xl">
                    {projects.map((project) => (
                        <div key={project.id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-3xl">{project.title}</h2>
                                <p>{project.description}</p>
                                <div className="card-actions justify-end">
                                    <button 
                                        className="btn btn-secondary" 
                                        onClick={() => openModal(project.id)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Render Modals */}
                {projects.map((project) => (
                    <Modal 
                        key={project.id}
                        isOpen={activeModal === project.id}
                        id={project.id}
                        title={project.title}
                        content={project.details}
                        onClose={closeModal}
                    />
                ))}

               

              
               
            </div>
        </div>
    );
}