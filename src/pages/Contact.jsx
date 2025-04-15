import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Navbar from '../components/Navbar';
import "../App.css";
import ErrorPage from './ErrorPage';




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

  return(
     <>
       <Navbar />
          <section className=" black:text-white black:bg:white" >
              <div className='padding'>
       {success && (
         <div className="px-4 py-2 bg-green-500 text-white text-center rounded-md mb-4">
           ✅ Your message has been sent successfully! Redirecting...
        </div>
      )}

       <form ref={form} onSubmit={sendEmail}>
       <section className="my-8 bg-gray-600 dark:bg-gray-100 text-gray-100 dark:text-gray-800">
       
      


    </section>
     
       </form>
      </div>
        </section>
        {/* Award / Scholarships */}
        <section className="p-6 dark:bg-gray-100 dark:text-gray-900">
        <form className="container flex flex-col mx-auto space-y-12" ref={form} onSubmit={sendEmail}>
	
		<fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-50">
			<div className="space-y-2 col-span-full lg:col-span-1">
				<p className="font-medium">Personal Inormation</p>
				<p className="text-xs">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci fuga autem eum!</p>
			</div>
			<div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
				<div className="col-span-full sm:col-span-3">
					<label htmlFor="firstname" className="text-sm">First name</label>
					<input id="name" type="text" placeholder="First name" className="w-full rounded-md focus:ring focus:ring-opacity-75 dark:text-gray-50 focus:dark:ring-violet-600 dark:border-gray-300" />
				</div>
				<div className="col-span-full sm:col-span-3">
					<label htmlFor="lastname" className="text-sm">Last name</label>
					<input id="lastname" type="text" placeholder="Last name" className="w-full rounded-md focus:ring focus:ring-opacity-75 dark:text-gray-50 focus:dark:ring-violet-600 dark:border-gray-300" />
				</div>
				<div className="col-span-full sm:col-span-3">
					<label htmlFor="email" className="text-sm">Email</label>
					<input id="email" type="email" placeholder="Email" className="w-full rounded-md focus:ring focus:ring-opacity-75 dark:text-gray-50 focus:dark:ring-violet-600 dark:border-gray-300" />
				</div>

        <div className="col-span-full sm:col-span-3">
					<label htmlFor="message" className="text-sm">Message</label>
					<input id="message" type="text" placeholder="Message..." className="w-full rounded-md focus:ring focus:ring-opacity-75 dark:text-gray-50 focus:dark:ring-violet-600 dark:border-gray-300" />
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
		</fieldset>

	</form>
</section>
    
        </>
  );
}

export default Contact;