
import Navbar from "../components/Navbar";
import IntroImageContainer from "../components/IntroImageContainer";

export default function About2() {
  return (
  <>
 <Navbar />
 
 <div className="relative grid min-h-screen grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] bg-white [--pattern-fg:var(--color-gray-950)]/5 dark:bg-gray-950 dark:[--pattern-fg:var(--color-white)]/10">
  <div className="col-start-3 row-start-3 flex max-w-lg flex-col bg-gray-100 p-2 dark:bg-white/10"> {/* Closing the div for col-start-3 row-start-3 */}
          <div className="rounded-xl bg-white p-10 text-sm/7 text-gray-700 dark:bg-gray-950 dark:text-gray-300">
            
            <img src="/public/gradBack.svg" className="mb-11.5 h-6 not-dark:hidden" alt="Tailwind Play" />
            </div>
            </div>
            </div>
      <div id="about" className="p-6 bg:dark dark:text-white" >
 
  
  {/* Award / Scholarships */}
 

  <div className="container flex flex-col items-center p-4 mx-auto space-y-2 md:p-8">
  <IntroImageContainer />
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#D6A800" className="w-16 h-16 text-violet-400 dark:text-violet-600">
      <polygon points="328.375 384 332.073 458.999 256.211 406.28 179.924 459.049 183.625 384 151.586 384 146.064 496 182.756 496 256.169 445.22 329.242 496 365.936 496 360.414 384 328.375 384"></polygon>
      <path d="M415.409,154.914l-2.194-48.054L372.7,80.933,346.768,40.414l-48.055-2.2L256,16.093,213.287,38.219l-48.055,2.2L139.3,80.933,98.785,106.86l-2.194,48.054L74.464,197.628l22.127,42.715,2.2,48.053L139.3,314.323l25.928,40.52,48.055,2.195L256,379.164l42.713-22.126,48.055-2.195,25.928-40.52L413.214,288.4l2.195-48.053,22.127-42.715Zm-31.646,76.949L382,270.377l-32.475,20.78-20.78,32.475-38.515,1.76L256,343.125l-34.234-17.733-38.515-1.76-20.78-32.475L130,270.377l-1.759-38.514L110.5,197.628,128.237,163.4,130,124.88,162.471,104.1l20.78-32.474,38.515-1.76L256,52.132l34.234,17.733,38.515,1.76,20.78,32.474L382,124.88l1.759,38.515L401.5,197.628Z"></path>
    </svg>
    <p className="px-6 py-2 text-2xl font-semibold text-center sm:font-bold sm:text-3xl md:text-4xl lg:max-w-2xl xl:max-w-4xl text-gray-300 dark:text-primary">"I have to go on record and state this: He greatest person ever."</p>
 
  </div>
</div>
</>
);
}

    
    