import React,{useState} from "react";
import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdAdd,
} from 'react-icons/md';
import { GoTasklist } from "react-icons/go";


// Admin Imports
import MainDashboard from 'views/admin/default';
import DataTables from 'views/admin/dataTables';
import Profile from 'views/admin/profile';
import CreateIssuePage from "views/admin/CreateIssuePage";
import Yourwork from "views/admin/your-work";
import JiraLikeWorkflow from "views/admin/JiraWorkflow";
// const Open = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const handleCreateIssueClick = () => {
//     setIsModalOpen(true);
//   };
  
//   const closeModal = () => {
//     setIsModalOpen(false);
//   };
// }


// Define routes
const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Create',
    layout: '/admin',
    path: '/create',
    icon: <Icon as={MdAdd} width="20px" height="20px" color="inherit" />,
    component: <CreateIssuePage />
  },
  {
    name: 'Defects Dashboard',
    layout: '/admin',
    path: '/data-tables',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <DataTables />,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Your Work',
    layout: '/admin',
    path: '/your-work',
    icon: <Icon as={GoTasklist} width="20px" height="20px" color="inherit" />,
    component: <Yourwork />,
  },
  // {
  //   name: 'Jira Workflow',
  //   layout: '/admin',
  //   path: '/workflow',
  //   icon: <Icon as={GoTasklist} width="20px" height="20px" color="inherit" />,
  //   component: <JiraLikeWorkflow />,
  // },
];

export default routes;
