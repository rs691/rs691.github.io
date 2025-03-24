import Layout from "./Layout";
import "./App.css";
import IntroImageContainer from "./components/IntroImageContainer";
import Title from "./components/Title";






function App() {
  return (

   
    <Layout>
        
      <div className="padding">
  
      <Title/>
        </div>
    
    <IntroImageContainer />
    </Layout>
   

  
  );
}

export default App;
