import PropTypes from 'prop-types';
import './index.css';
import Navbar2 from './components/Navbar2';


function Layout({ children }) {
  return (
    <div className="layout">
     
{/* <Navbar /> */}
<Navbar2 />

    
    
      <main>
        
        <section id="about" className="p-4">
       
       
         

          {children}
        </section>
     
      </main>





	
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
