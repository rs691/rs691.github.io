import PropTypes from "prop-types";
import "./index.css";
import "./css/styles.css";
import Navbar from "./components/Navbar";
import CardContainer from "./components/CardContainer";



function Layout({ children }) {
  return (
    


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
