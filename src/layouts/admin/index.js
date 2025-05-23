// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import routes from 'routes.js';

export default function Dashboard(props) {
  const { ...rest } = props;
  const location = useLocation();
  const { onOpen } = useDisclosure();
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const getRoute = () => location.pathname !== '/admin/full-screen-maps';

  // ✅ Helper for dynamic path matching
  const matchPathWithDynamicSegments = (definedPath, currentPath) => {
    const regexPath = definedPath
      .replace(/:\w+/g, '[^/]+')  // Replace :params with regex wildcard
      .replace(/\//g, '\\/');     // Escape slashes for regex
    const regex = new RegExp(`^${regexPath}$`);
    return regex.test(currentPath);
  };

  const getActiveRoute = (routes) => {
    let activeRoute = 'Default Brand Text';
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (route.collapse || route.category) {
        const childRoute = getActiveRoute(route.items);
        if (childRoute !== 'Default Brand Text') return childRoute;
      } else if (
        matchPathWithDynamicSegments(route.layout + route.path, location.pathname)
      ) {
        return route.name;
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (route.collapse || route.category) {
        const child = getActiveNavbar(route.items);
        if (child) return child;
      } else if (
        matchPathWithDynamicSegments(route.layout + route.path, location.pathname)
      ) {
        return route.secondary || false;
      }
    }
    return false;
  };

  const getActiveNavbarText = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (route.collapse || route.category) {
        const child = getActiveNavbarText(route.items);
        if (child) return child;
      } else if (
        matchPathWithDynamicSegments(route.layout + route.path, location.pathname)
      ) {
        return route.messageNavbar || '';
      }
    }
    return '';
  };

  const getRoutes = (routes) =>
    routes.map((route, key) => {
      if (route.layout === '/admin') {
        return (
          <Route path={`${route.path}`} element={route.component} key={key} />
        );
      } else if (route.collapse || route.category) {
        return getRoutes(route.items);
      }
      return null;
    });

  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Sidebar routes={routes} display="none" {...rest} />
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
          maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          <Portal>
            <Box>
              <Navbar
                onOpen={onOpen}
                logoText={'Horizon UI Dashboard PRO'}
                brandText={getActiveRoute(routes)}
                secondary={getActiveNavbar(routes)}
                message={getActiveNavbarText(routes)}
                fixed={fixed}
                {...rest}
              />
            </Box>
          </Portal>

          {getRoute() && (
            <Box
              mx="auto"
              p={{ base: '20px', md: '30px' }}
              pe="20px"
              minH="100vh"
              pt="100px"
            >
              <Routes>
                {getRoutes(routes)}
                <Route
                  path="/"
                  element={<Navigate to="/admin/default" replace />}
                />
              </Routes>
            </Box>
          )}
          <Box>{/* <Footer /> */}</Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
