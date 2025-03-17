import './App.css'

function Layout() {
  return (
  
    <div className="antialiased bg-black text-gray-100">
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="container flex items-center justify-between w-full max-w-3xl px-6 py-10 mx-auto xl:max-w-5xl">
          <h1 className="text-3xl font-bold">Robert Stewart</h1>
          <nav className="hidden space-x-4 sm:flex">
            <a href="#about" className="p-2 hover:underline">About</a>
            <a href="#experience" className="p-2 hover:underline">Experience</a>
            <a href="#projects" className="p-2 hover:underline">Projects</a>
            <a href="#contact" className="p-2 hover:underline">Contact</a>
          </nav>
        </header>

        {/* About Section */}
        <section id="about" className="container max-w-3xl px-6 py-12 mx-auto xl:max-w-5xl">
          <h2 className="text-2xl font-bold">About Me</h2>
          <p className="mt-4 text-gray-300">
            I am a passionate software developer specializing in full-stack development, with expertise in Angular, Django, and MySQL.
          </p>
        </section>

        {/* Experience Section */}
        <section id="experience" className="container max-w-3xl px-6 py-12 mx-auto xl:max-w-5xl">
          <h2 className="text-2xl font-bold">Experience</h2>
          <ul className="mt-4 space-y-4">
            <li>
              <h3 className="text-lg font-semibold">Software Developer - Moffat Bay</h3>
              <p className="text-gray-400">Developed a web application using Django, MySQL, and Bootstrap 5.</p>
            </li>
          </ul>
        </section>

        {/* Projects Section */}
        <section id="projects" className="container max-w-3xl px-6 py-12 mx-auto xl:max-w-5xl">
          <h2 className="text-2xl font-bold">Projects</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-4 bg-gray-900 rounded-lg">
              <h3 className="text-lg font-semibold">Personal Resume Website</h3>
              <p className="text-gray-400">Built using React, Tailwind CSS, and MambaUI.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="container max-w-3xl px-6 py-12 mx-auto xl:max-w-5xl">
          <h2 className="text-2xl font-bold">Contact</h2>
          <p className="mt-4 text-gray-300">Email: robert.stewart@example.com</p>
        </section>
    

    <section id="about" className="container max-w-3xl px-6 py-12 mx-auto xl:max-w-5xl">
      <h2 className="text-2xl font-bold">About Me</h2>
      <p className="mt-4 text-gray-300">
        I am a passionate software developer specializing in full-stack development, with expertise in Angular, Django, and MySQL.
      </p>
    </section>

    </div>
    </div>
    

  );
}

export default Layout;