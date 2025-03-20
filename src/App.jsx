import Layout from "./Layout";
import "./App.css";









function App() {
  return (
  
    <Layout>
     
    
     <div className="hero bg-transparent py-16">
                    <div className="hero-content text-center">
                        <div className="max-w-1xl">
                            <span className="relative col-start-1 row-start-2 bg-[linear-gradient(90deg,#6439FF,#00CCDD)] bg-clip-text text-transparent font-cabin md:leading-[100px] text-[30px] sm:text-[40px] lg:text-[80px] xl:text-[116px] font-[600] tracking-tight z-10">
                                Hello, my name is Robert.{" "}
                            </span>
                            <p className="text-4xl font-bold text-center mt-4">
                                and I&apos;m a software developer.
                            </p>
                        </div>
                    </div>
                </div>
    <div className="rounded-xl p-10 text-sm/7 text-white dark:bg-white dark:text-green-300">
      
          <div className="mx-auto max-w-md overflow-hidden md:max-w-2xl">
            <div className="md:flex">
              <div className="md:shrink-0">
                <img
                  className="h-48 w-full object-cover md:h-full md:w-48 rounded-b-3xl"
                  src="../public/me.svg"
                  alt="self"
                />
              </div>

              <div className="p-8">
              

                <p className="mt-2 text-gray-500">
                  Looking to take your team away on a retreat to enjoy awesome
                  food and take in some sunshine? We have a list of places to do
                  just that.
                </p>
              </div>
            </div>
          </div>
        </div>
     
    </Layout>
   
    
  );
}

export default App;
