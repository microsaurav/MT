// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
// import Navbar from 'components/Navbar ABHI/Navbar';
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
  const [collapsed, setCollapsed] = useState(true);

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
    <Box position="relative">
      <SidebarContext.Provider
        value={{
          collapsed,
          setCollapsed,
        }}
      >
        {/* Update: Passing `collapsed` and `setCollapsed` state to Sidebar */}
        <Sidebar
          routes={routes}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          pt="80px"
          zIndex="sticky"
          {...rest}
        />
        <Box
          display="flex"
          flexDirection="column"
          maxHeight="100vh"
          transition="all 0.2s linear"
          ml={{ base: 0, xl: collapsed ? '80px' : '300px' }}
          overflowY="hidden"
        >
          <Box position="sticky" top="0" zIndex="sticky" maxW={{ base: 0, xl: collapsed ? '80px' : '400px' }}>
            <Portal>
              <Navbar
                collapsed={collapsed}
                onOpen={onOpen}
                logoText={'Horizon UI Dashboard PRO'}
                brandText={getActiveRoute(routes)}
                secondary={getActiveNavbar(routes)}
                message={getActiveNavbarText(routes)}
                fixed={fixed}
                {...rest}
              />
            </Portal>
          </Box>
          <Box flex="1" height="100%">
            {getRoute() && (
              <Box
                mx="auto"
                p={{ base: '20px', md: '30px' }}
                pe="20px"
                height="100%"
                pt="40px"
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
          </Box>
          <Box>{/* <Footer /> */}</Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
