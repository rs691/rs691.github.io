import PropTypes from "prop-types";
import "./index.css";
import "./css/styles.css";
// import Navbar from "./components/Navbar";
import Nav3 from "./components/Nav3";

import "./css/layout.css";
function Layout({ children }) {
  return (
    <div className="layout">
      <Nav3 />
      <main>
        {children}
        </main>
       
    </div>
  );
}


Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
