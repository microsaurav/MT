import React from 'react';
import AdminNavbarLinks from '../navbar/NavbarLinksAdmin';
import img from '../../assets/img/abhi_logo.svg';
import { Box, Image } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // Hide AdminNavbarLinks on auth sign-in page
  const isAuthPage = location.pathname === '/auth/sign-in/default';

  return (
    <Box
      className="navbar-container"
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="70px"
      zIndex="1000"
      // borderBottom=".1rem solid #EBEBEC"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      // bg="#C91429"
    >
      <Box
        className="navbar-logo-box"
        width="109px"
        padding="7px 13px 7px 21px"
        // bg="white"
      >
        <a href="#">
          <Image src={img} alt="ABHI" width="73px" height="35px" />
        </a>
      </Box>
      <Box
        pr={5}
        h="100%"
        className="navbar-links-box"
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        flex="1"
        borderBottomLeftRadius="14px"
        bg="#C91429"
      >
        {!isAuthPage && (
          <AdminNavbarLinks
            className="adminNavbar"
            logoText={'Horizon UI Dashboard PRO'}
          // secondary={props.secondary}
          // fixed={props.fixed}
          // scrolled={props.scrolled}
          />
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
