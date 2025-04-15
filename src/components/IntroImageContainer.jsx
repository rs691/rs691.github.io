import "../css/styles.css";
// import "../css/page.css";

function IntroImageContainer() {
  return (
    <>
  
   
    <div className="flex justify-center items-center"> {/* Center the container */}
      <div className="mx-auto max-w-md overflow-hidden rounded-xl md:max-w-3xl "> {/* Add shadow for better visual separation */}
        <div className="md:flex md:items-center"> {/* Align image and text vertically in medium and larger screens */}
          <div className="md:shrink-0">
            <div className="rounded-xl overflow-hidden md:rounded-l-xl md:rounded-r-none"> {/* Apply rounded corners appropriately */}
              
              <img
                className="roundedImage2 text-sky-400" // Make image fill its container and maintain aspect ratio
                alt="Robert Stewart Selfie"
                src="./SelfieOp3.png"
              />
              
            </div>
          </div>
  
         
          <div className="p-8">
            <p className="my-2 bg-gradient-to-r from-amber-600 to-blue-600 bg-clip-text text-4xl md:text-6xl font-semibold text-transparent">
              Robert Stewart
            </p>
          

            <div
              id="img-sub"
              className="text-sm font-bold tracking-wide light:text-black"
            >
              Over the years, I have developed a passion for software development.
              I have worked on various projects and have gained experience in
              different programming languages. During my time as a tutor, I had
              the opportunity to work with many different types of people. I am
              always eager to learn new things and improve my skills.
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default IntroImageContainer;