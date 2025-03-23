import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Navbar from '../components/Navbar';
import "../App.css";

const Contact = () => {
  const form = useRef();
  const [success, setSuccess] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_8760sm9', 'contact_form', form.current, {
        publicKey: 'cDb0tNEXvPJfa9x4O',
      })
      .then(
        () => {
          // Show success message
          setSuccess(true);

          // Reset the form after sending the email
          form.current.reset();

          console.log('SUCCESS!');

          // Hide success message after 3 seconds
          setTimeout(() => {
            setSuccess(false);
            window.location.href = '/'; // Redirect after delay
          }, 3000);
        },
        (error) => {
          console.log('FAILED...', error.text);
        }
      );
  };

  return (
    <>
    <Navbar />
    <div className='padding'>
      {success && (
        <div className="px-4 py-2 bg-green-500 text-white text-center rounded-md mb-4">
          ✅ Your message has been sent successfully! Redirecting...
        </div>
      )}

      <form ref={form} onSubmit={sendEmail}>
        <section className="p-6 black:text-white black:bg:white">
          <div className="container w-full max-w-xl p-8 mx-auto space-y-6 rounded-md shadow bg-gray-900 dark:bg-gray-50">
            <h2 className="w-full text-3xl font-bold leading-tight bg:dark text-white">Contact Me</h2>
            <div>
              <label htmlFor="name" className="block mb-1 ml-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                required
                className="block w-full p-2 rounded focus:outline-none focus:ring focus:ring-opacity-25 focus:ring-violet-400 focus:dark:ring-violet-600 bg-white dark:bg-white text-black"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 ml-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your email"
                required
                className="block w-full p-2 rounded focus:outline-none focus:ring focus:ring-opacity-25 focus:ring-violet-400 focus:dark:ring-violet-600 bg-white dark:bg-white text-black"
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1 ml-1">
                Message
              </label>
              <textarea
                id="message"
                type="text"
                placeholder="Message..."
                className="block w-full p-2 rounded autoexpand focus:outline-none focus:ring focus:ring-opacity-25 focus:ring-violet-400 focus:dark:ring-violet-600 bg-white dark:bg-white text-black"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-bold rounded shadow focus:outline-none focus:ring hover:ring focus:ring-opacity-50 bg-violet-400 dark:bg-violet-600 focus:ring-violet-400 focus:dark:ring-violet-600 hover:ring-violet-400 hover:dark:ring-violet-600 text-gray-900 dark:text-gray-50"
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </form>
      </div>
    </>
  );
};

export default Contact;
