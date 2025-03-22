

function IntroImageContainer() {
    return (  
  <div className="p-6 bg:dark dark:text-white">
  <div className="mx-auto max-w-md overflow-hidden rounded-xl md:max-w-2xl">
    <div className="md:flex">
      <div className="md:shrink-0">
      <img className="rounded-lg w-60" src="../public/me.svg" alt="self" />
      
      </div>
      <div className="p-8">
        <div id="img-sub" className="text-sm font-semibold tracking-wide bg:dark dark:text-white "> Over the years, I have developed a passion for software development.
        I have worked on various projects and have gained experience in different programming languages.
        During my time as a tutor, I had the opportunity to work with many different types of people.
        I am always eager to learn new things and improve my skills.
        </div>
      </div>
    </div>
  </div>
  </div>
      );
  }
  export default IntroImageContainer;