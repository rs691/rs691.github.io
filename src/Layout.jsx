import PropTypes from "prop-types";
import "./index.css";
import "./css/styles.css";
import Navbar from "./components/Navbar";
import CardContainer from "./components/CardContainer";
import "./css/layout.css";




function Layout({ children }) {
  return (
    
   
    //set background to an image
  
    <div className="layout">
     
  
      <Navbar />
      <CardContainer>
      <main>
       
        {children}
        </main>
        </CardContainer>
    </div>
    
   
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
