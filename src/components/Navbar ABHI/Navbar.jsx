import React from 'react';
import './Navbar.css'; 
import img from '../../assets/img/abhi_logo.svg'; // Import the CSS file for loading spinner
const Navbar = () => {
  return (
    <div className="logoMain">
      <div className="logoMainLeft">
        <a href="#">
          <img src={img} alt="ABHI" />
        </a>
      </div>
      <div className="logoMainRight">
        <div className="logoLeftNav">
          {" "}
        </div>
        <div className="logoRightNav">
          <div className="header-right-cnt">
            
          </div>
          <div className="headerProfile">
            {/* Profile content can go here */}
          </div>
          <div className="header_notification">
            {/* Notification content can go here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
