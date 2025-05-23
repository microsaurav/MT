 import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme'; // Your theme file
import { useState } from 'react';
import Navbar from 'components/Navbar ABHI/Navbar'; // Your Navbar component
import AdminLayout from './layouts/admin'; // Import your AdminLayout
import AuthLayout from './layouts/auth'; // Auth layout if needed
import RTLLayout from './layouts/rtl'; // RTL layout if needed
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  
  return (
    <ChakraProvider theme={currentTheme}>
      <Navbar />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
      />
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={<AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />}
        />
        <Route
          path="rtl/*"
          element={<RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />}
        />
        <Route path="/" element={<Navigate to="/admin/default" replace />} />
      </Routes>
    </ChakraProvider>
  );
}

export default Main;
