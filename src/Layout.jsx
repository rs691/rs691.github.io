import PropTypes from 'prop-types';
import './index.css';
import Navbar from './components/Navbar';


function Layout({ children }) {
  return (
    <div className="layout">
     
{/* <Navbar /> */}
<Navbar />

    
    
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
