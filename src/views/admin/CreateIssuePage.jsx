import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Input,
  Textarea,
  Button,
  Select,
  FormControl,
  FormLabel,
  useColorModeValue,
  Flex,
  Icon,
  useDisclosure,
 
} from '@chakra-ui/react';
import Multiselect from 'multiselect-react-dropdown';

import { MdCheckCircle} from 'react-icons/md';
import Card from 'components/card/Card'; // Your custom Card component

export default function CreateIssueModal() {
  const [issueData, setIssueData] = useState({
    project: '',
    issueType:'',
    issueDescription: '',
    severity: '',
    priority: '',
    dueDate: '',
    reporter: '',
    assignee: '',
    tags: [],
  });
  const [itbugData, setITBugData] = useState({
    workstream: '',
    defectType:'',
    productType:'',
    primaryApplication: '',
    summary: '',
    defectDescription: '',
    linkedIssue: '',
    severity: '',
    priority: '',
    environment:'',
    impactedSystem:[],
    module:'',
    assignee: '',
    steps:'',
    actualOutput:'',
    expectedOutput:'',
    noofTestCases:'',

  });
  const [apdmbugData, setApdmBugData] = useState({
    issueType:'',
    recurringType: '',
    productType:'',
    reportedBy: '',
    business: '',
    primaryApplication: '',
    summary: '',
    defectDesciption: '',
    priority: '',
    severity:'',
    impactedSystem:[],
    linkedIssue:'',
    assignee: '',
    actualOutput:'',
    expectedOutput:'',


  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  
  // Handling form submission
  const handleFormSubmit = () => {
    console.log('Form Submitted', issueData);
  };
  // Options for the dropdown
  
  // Handling tags addition
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      setIssueData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, e.target.value.trim()],
      }));
      e.target.value = ''; // Clear the input field after adding
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setIssueData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((tag) => tag !== tagToRemove),
    }));
  };
console.log("IssueData",issueData.project)
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card
        flexDirection="column"
        w="100%"
        px="25px"
        mb="20px"
        overflow="hidden"
      >
        <Box>
          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
            <FormControl isRequired>
              <FormLabel htmlFor="project" color="gray.400">
                Project
              </FormLabel>
              <Select
                id="project"
                value={issueData.project}
                onChange={(e) =>
                  setIssueData({ ...issueData, project: e.target.value })
                }
                borderColor={borderColor}
                _hover={{ borderColor: 'brandScheme.400' }}
                _focus={{ borderColor: 'brandScheme.400' }}
                backgroundColor="white"
              >
                <option value="" selected disabled>
                  Select an Option
                </option>
                <option value="IT">ABHI Change Request Management</option>
                {/* <option value="Prodcution">
                  ABHI Products Defect Management
                </option> */}
              </Select>
            </FormControl>

           
                <FormControl isRequired>
              <FormLabel htmlFor="severity" color="gray.400">
                Issue Type
              </FormLabel>
             
                
              <Select
                id="issueType"
                value={issueData.issueType}
                onChange={(e) =>
                  setIssueData({ ...issueData, issueType: e.target.value })
                }
                borderColor={borderColor}
                _hover={{ borderColor: 'brandScheme.400' }}
                _focus={{ borderColor: 'brandScheme.400' }}
                backgroundColor="white"
              >
                
                <option value="" disabled selected>
                  Select an option
                </option>
                <option value="CR">Change Request</option>
                <option value="Bug">Bug</option>
                <option value="Project">Project</option>
                <option value="BAU">BAU Projects</option>
                    
            
           
              </Select>
             
            </FormControl>
           
            
          </SimpleGrid>
          {issueData.project === 'IT' &&
            (issueData.issueType === 'CR' ||
              issueData.issueType === 'Project' ||
              issueData.issueType === 'BAU') && (
              <>
                <SimpleGrid columns={{ sm: 1, md: 1 }} spacing="20px" mb="24px">
                  {/* Issue Type */}
                  <FormControl isRequired>
                    <FormLabel htmlFor="issueType" color="gray.400">
                      Project/CR Name
                    </FormLabel>
                    <Textarea
                      id="issueDescription"
                      value={issueData.issueDescription}
                      onChange={(e) =>
                        setIssueData({
                          ...issueData,
                          issueDescription: e.target.value,
                        })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                      resize="none"
                      minHeight="20px"
                    />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
                  <FormControl isRequired>
                    <FormLabel htmlFor="severity" color="gray.400">
                      Business owner/Project Owner
                    </FormLabel>
                    <Select
                      id="severity"
                      value={issueData.severity}
                      onChange={(e) =>
                        setIssueData({ ...issueData, severity: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                    >
                      <option value="claims">Claims</option>
                      <option value="contact">Contact Center</option>
                      <option value="digital">Digital</option>
                      <option value="DOPs">DOPs</option>
                      <option value="embedded">Embedded Wellness</option>
                      <option value="finance">Finance</option>
                      <option value="finOps">FinOps</option>
                      <option value="fwa">FWA</option>
                      <option value="group">Group Operation</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <SimpleGrid columns={{ sm: 1, md: 1 }} spacing="20px" mb="24px">
                  {/* Issue Type */}
                  <FormControl isRequired>
                    <FormLabel htmlFor="issueType" color="gray.400">
                      Summary
                    </FormLabel>
                    <Textarea
                      id="issueDescription"
                      value={issueData.issueDescription}
                      onChange={(e) =>
                        setIssueData({
                          ...issueData,
                          issueDescription: e.target.value,
                        })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                      resize="none"
                      minHeight="20px"
                    />
                  </FormControl>
                </SimpleGrid>
                <SimpleGrid columns={{ sm: 1, md: 1 }} spacing="20px" mb="24px">
                  <FormControl isRequired>
                    <FormLabel htmlFor="issueDescription" color="gray.400">
                      Issue Description
                    </FormLabel>
                    <Textarea
                      id="issueDescription"
                      value={issueData.issueDescription}
                      onChange={(e) =>
                        setIssueData({
                          ...issueData,
                          issueDescription: e.target.value,
                        })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                      placeholder="Describe the issue in detail..."
                      resize="none"
                      minHeight="150px"
                    />
                  </FormControl>
                  <SimpleGrid
                    columns={{ sm: 1, md: 1 }}
                    spacing="20px"
                    mb="24px"
                  >
                    {/* Issue Type */}
                    <FormControl isRequired>
                      <FormLabel htmlFor="issueType" color="gray.400">
                        In Scope
                      </FormLabel>
                      <Textarea
                        id="issueDescription"
                        value={issueData.issueDescription}
                        onChange={(e) =>
                          setIssueData({
                            ...issueData,
                            issueDescription: e.target.value,
                          })
                        }
                        borderColor={borderColor}
                        _hover={{ borderColor: 'brandScheme.400' }}
                        _focus={{ borderColor: 'brandScheme.400' }}
                        backgroundColor="white"
                        resize="none"
                        minHeight="90px"
                      />
                    </FormControl>
                  </SimpleGrid>
                  <SimpleGrid
                    columns={{ sm: 1, md: 1 }}
                    spacing="20px"
                    mb="24px"
                  >
                    <FormControl isRequired>
                      <FormLabel htmlFor="issueType" color="gray.400">
                        Out Scope
                      </FormLabel>
                      <Textarea
                        id="issueDescription"
                        value={issueData.issueDescription}
                        onChange={(e) =>
                          setIssueData({
                            ...issueData,
                            issueDescription: e.target.value,
                          })
                        }
                        borderColor={borderColor}
                        _hover={{ borderColor: 'brandScheme.400' }}
                        _focus={{ borderColor: 'brandScheme.400' }}
                        backgroundColor="white"
                        resize="none"
                        minHeight="90px"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl isRequired>
                    <FormLabel htmlFor="priority" color="gray.400">
                      Priority
                    </FormLabel>
                    <Select
                      id="priority"
                      value={issueData.priority}
                      onChange={(e) =>
                        setIssueData({ ...issueData, priority: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
                  <FormControl>
                    <FormLabel htmlFor="assignee" color="gray.400">
                      Assignee
                    </FormLabel>
                    <Input
                      id="assignee"
                      value={issueData.assignee}
                      onChange={(e) =>
                        setIssueData({ ...issueData, assignee: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="workstream" color="gray.400">
                      WorkStream and Business Function
                    </FormLabel>
                    <Select
                      id="workstream"
                      value={issueData.priority}
                      onChange={(e) =>
                        setIssueData({ ...issueData, priority: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                    >
                      <option value="" disabled selected>
                        Select an option
                      </option>
                      <option value="product">Product & Pricing</option>
                      <option value="digital">Digital</option>
                      <option value="operation">Operation</option>
                      <option value="sales">Sales</option>
                      <option value="marketing">Marketing</option>
                      <option value="legal">Legal</option>
                      <option value="finance">Finance</option>
                      <option value="IT">IT</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
                  {/* Assignee */}
                  <FormControl>
                    <FormLabel htmlFor="assignee" color="gray.400">
                      Module (Multi-select)
                    </FormLabel>
                    <Multiselect
                      placeholder="Select an Option"
                      options={[
                        { value: 'active', label: 'Active Days' },
                        { value: 'claims', label: 'Claims' },
                        { value: 'digital', label: 'Digital Health Assesment' },
                      ]}
                      displayValue="label"
                      style={{
                        control: {
                          borderColor: borderColor,
                          backgroundColor: 'white',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          fontSize: '16px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          transition: 'border-color 0.2s ease',
                        },
                        optionContainer: {
                          borderRadius: '8px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          marginTop: '8px',
                          zIndex: 999,
                          backgroundColor: '#f9f9f9',
                          maxHeight: '200px', // Add max height to the dropdown container
                          overflowY: 'auto', // Allow scrolling for overflow
                        },
                        option: {
                          padding: '10px',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          color: '#333',
                          '&:hover': {
                            backgroundColor: '#007bff', // Hover color
                            color: '#fff',
                          },
                          '&:active': {
                            backgroundColor: '#0056b3', // Active color
                            color: '#fff',
                          },
                        },
                        selectedList: {
                          padding: '4px 10px',
                          backgroundColor: '#007bff',
                          borderRadius: '8px',
                          marginRight: '8px',
                          fontSize: '14px',
                          display: 'inline-block',
                          marginBottom: '4px',
                          color: '#fff',
                        },
                        chip: {
                          backgroundColor: '#007bff',
                          fontSize: '14px',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          margin: '2px',
                        },
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="tags" color="gray.400">
                      WorkStream and Business Function
                    </FormLabel>
                    <Select
                      id="workstream"
                      value={issueData.priority}
                      onChange={(e) =>
                        setIssueData({ ...issueData, priority: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                    >
                      <option value="" disabled selected>
                        Select an option
                      </option>
                      <option value="product">Product & Pricing</option>
                      <option value="digital">Digital</option>
                      <option value="operation">Operation</option>
                      <option value="sales">Sales</option>
                      <option value="marketing">Marketing</option>
                      <option value="legal">Legal</option>
                      <option value="finance">Finance</option>
                      <option value="IT">IT</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <SimpleGrid columns={{ sm: 1, md: 1 }} spacing="20px" mb="24px">
                  {/* Assignee */}
                  <FormControl>
                    <FormLabel htmlFor="assignee" color="gray.400">
                      Business Need (Multi-select)
                    </FormLabel>
                    <Multiselect
                      placeholder="Select an Option"
                      options={[
                        { value: 'audit', label: 'Audit Observation' },
                        { value: 'cost', label: 'Cost Reduction/Avoidence' },
                        { value: 'customer', label: 'Customer Experience' },
                        {
                          value: 'customer On_boarding',
                          label: 'Customer OnBoarding',
                        },
                        {
                          value: 'distributor',
                          label: 'Distributor Experience',
                        },
                        { value: 'employee', label: 'Employee Experience' },
                        { value: 'operation', label: 'Operation Efficiency' },
                        { value: 'partner', label: 'Partner On-Boarding' },
                        { value: 'regulatory', label: 'Regulatory' },
                        { value: 'revenue', label: 'Revenue Generation' },
                        { value: 'risk management', label: 'Risk Management' },
                        { value: 'tech', label: 'Tech Scalability' },
                      ]}
                      displayValue="label"
                      style={{
                        control: {
                          borderColor: borderColor,
                          backgroundColor: 'white',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          fontSize: '16px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          transition: 'border-color 0.2s ease',
                        },
                        optionContainer: {
                          borderRadius: '8px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          marginTop: '8px',
                          zIndex: 999,
                          backgroundColor: '#f9f9f9',
                          maxHeight: '200px', // Add max height to the dropdown container
                          overflowY: 'auto', // Allow scrolling for overflow
                        },
                        option: {
                          padding: '10px',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          color: '#333',
                          '&:hover': {
                            backgroundColor: '#007bff', // Hover color
                            color: '#fff',
                          },
                          '&:active': {
                            backgroundColor: '#0056b3', // Active color
                            color: '#fff',
                          },
                        },
                        selectedList: {
                          padding: '4px 10px',
                          backgroundColor: '#007bff',
                          borderRadius: '8px',
                          marginRight: '8px',
                          fontSize: '14px',
                          display: 'inline-block',
                          marginBottom: '4px',
                          color: '#fff',
                        },
                        chip: {
                          backgroundColor: '#007bff',
                          fontSize: '14px',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          margin: '2px',
                        },
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="tags" color="gray.400">
                      Business Need Benefits details calculation (Tangible and
                      intangible benefits)
                    </FormLabel>
                    <Textarea
                      id="issueDescription"
                      value={issueData.issueDescription}
                      onChange={(e) =>
                        setIssueData({
                          ...issueData,
                          issueDescription: e.target.value,
                        })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                      resize="none"
                      minHeight="90px"
                    />
                  </FormControl>
                </SimpleGrid>
              </>
            )}
          {issueData.project === 'IT' && issueData.issueType === 'Bug' && (
            <>
              <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
                {/* Issue Type */}
                <FormControl isRequired>
                  <FormLabel htmlFor="issueType" color="gray.400">
                    Workstream and BusinessFunction
                  </FormLabel>
                  <Select
                    id="workstream"
                    value={itbugData.workstream}
                    onChange={(e) =>
                      setITBugData({ ...itbugData, workstream: e.target.value })
                    }
                    borderColor={borderColor}
                    _hover={{ borderColor: 'brandScheme.400' }}
                    _focus={{ borderColor: 'brandScheme.400' }}
                    backgroundColor="white"
                  >
                    <option value="" disabled selected>
                      Select an option
                    </option>
                    <option value="product">Product & Pricing</option>
                    <option value="digital">Digital</option>
                    <option value="operation">Operation</option>
                    <option value="sales">Sales</option>
                    <option value="marketing">Marketing</option>
                    <option value="legal">Legal</option>
                    <option value="finance">Finance</option>
                    <option value="IT">IT</option>
                  </Select>
                </FormControl>
                {/* Issue Type */}
                <FormControl isRequired>
                  <FormLabel htmlFor="issueType" color="gray.400">
                    Defect Type
                  </FormLabel>
                  <Select
                    id="defectType"
                    value={itbugData.defectType}
                    onChange={(e) =>
                      setITBugData({ ...itbugData, defectType: e.target.value })
                    }
                    borderColor={borderColor}
                    _hover={{ borderColor: 'brandScheme.400' }}
                    _focus={{ borderColor: 'brandScheme.400' }}
                    backgroundColor="white"
                  >
                    <option value="" disabled selected>
                      Select an option
                    </option>
                    <option value="QA">QA Testing</option>
                    <option value="sanity">Sanity Testing</option>
                    <option value="regression">Regression</option>
                    <option value="UAT">UAT Testing</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={{ sm: 1, md: 1 }} spacing="20px" mb="24px">
                {/* Issue Type */}
                <FormControl isRequired>
                  <FormLabel htmlFor="issueType" color="gray.400">
                    Primary Application
                  </FormLabel>
                  <Select
                    id="primaryApplication"
                    value={itbugData.primaryApplication}
                    onChange={(e) =>
                      setITBugData({
                        ...itbugData,
                        primaryApplication: e.target.value,
                      })
                    }
                    borderColor={borderColor}
                    _hover={{ borderColor: 'brandScheme.400' }}
                    _focus={{ borderColor: 'brandScheme.400' }}
                    backgroundColor="white"
                  >
                    <option value="" disabled selected>
                      Select an option
                    </option>
                    <option value="aarambh">Aarambh</option>
                    <option value="abhiConnect">ABHI Connect</option>
                    <option value="abhiProviderPortal">
                      ABHI ProviderPortal
                    </option>
                    <option value="abhiWebsite">ABHI Website</option>
                    <option value="activHealth">Activ Health</option>
                    <option value="legal">Legal</option>
                    <option value="finance">Finance</option>
                    <option value="IT">IT</option>
                  </Select>
                </FormControl>
                {/* Issue Type */}
                <FormControl isRequired>
                  <FormLabel htmlFor="issueType" color="gray.400">
                    Summary
                  </FormLabel>
                  <Textarea
                    id="summary"
                    value={itbugData.summary}
                    onChange={(e) =>
                      setITBugData({
                        ...itbugData,
                        itbugData: e.target.value,
                      })
                    }
                    borderColor={borderColor}
                    _hover={{ borderColor: 'brandScheme.400' }}
                    _focus={{ borderColor: 'brandScheme.400' }}
                    backgroundColor="white"
                    resize="none"
                    minHeight="20px"
                  />
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={{ sm: 1, md: 1 }} spacing="20px" mb="24px">
                <FormControl isRequired>
                  <FormLabel htmlFor="defectDesciption" color="gray.400">
                    Defect Description
                  </FormLabel>
                  <Textarea
                    id="defectDesciption"
                    value={itbugData.defectDesciption}
                    onChange={(e) =>
                      setITBugData({
                        ...itbugData,
                        defectDesciption: e.target.value,
                      })
                    }
                    borderColor={borderColor}
                    _hover={{ borderColor: 'brandScheme.400' }}
                    _focus={{ borderColor: 'brandScheme.400' }}
                    backgroundColor="white"
                    placeholder="Describe the defect in detail..."
                    resize="none"
                    minHeight="150px"
                  />
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={{ sm: 1, md: 1 }} spacing="20px" mb="24px">
                <FormControl isRequired>
                  <FormLabel htmlFor="linkedIssue" color="gray.400">
                    Linked Issue
                  </FormLabel>
                  <Multiselect
                    placeholder="Select an Option"
                    options={[
                      { value: 'IT-7886', label: 'IT-7886' },
                      { value: 'claims', label: 'Claims' },
                      { value: 'digital', label: 'Digital Health Assesment' },
                    ]}
                    displayValue="label"
                    style={{
                        control: {
                          borderColor: borderColor,
                          backgroundColor: 'white',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          fontSize: '16px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          transition: 'border-color 0.2s ease',
                        },
                        optionContainer: {
                          borderRadius: '8px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          marginTop: '8px',
                          zIndex: 999,
                          backgroundColor: '#f9f9f9',
                          maxHeight: '200px', // Add max height to the dropdown container
                          overflowY: 'auto', // Allow scrolling for overflow
                        },
                        option: {
                          padding: '10px',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          color: '#333',
                          '&:hover': {
                            backgroundColor: '#007bff', // Hover color
                            color: '#fff',
                          },
                          '&:active': {
                            backgroundColor: '#0056b3', // Active color
                            color: '#fff',
                          },
                        },
                        selectedList: {
                          padding: '4px 10px',
                          backgroundColor: '#007bff',
                          borderRadius: '8px',
                          marginRight: '8px',
                          fontSize: '14px',
                          display: 'inline-block',
                          marginBottom: '4px',
                          color: '#fff',
                        },
                        chip: {
                          backgroundColor: '#007bff',
                          fontSize: '14px',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          margin: '2px',
                        },
                      }}
                  />
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
              <FormControl isRequired>
                    <FormLabel htmlFor="priority" color="gray.400">
                      Priority
                    </FormLabel>
                    <Select
                      id="priority"
                      value={issueData.priority}
                      onChange={(e) =>
                        setIssueData({ ...issueData, priority: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel htmlFor="severity" color="gray.400">
                    Severity
                    </FormLabel>
                    <Select
                      id="severity"
                      value={itbugData.severity}
                      onChange={(e) =>
                        setITBugData({ ...itbugData, severity: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
              <FormControl isRequired>
                    <FormLabel htmlFor="environment" color="gray.400">
                      Environment
                    </FormLabel>
                    <Select
                      id="environment"
                      value={itbugData.environment}
                      onChange={(e) =>
                        setITBugData({ ...itbugData, environment: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                    >
                      <option value="MIG">MIG</option>
                      <option value="MT UAT">MT UAT</option>
                      <option value="SIT">SIT</option>
                      <option value="UAT">UAT</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel htmlFor="severity" color="gray.400">
                    Severity
                    </FormLabel>
                    <Select
                      id="severity"
                      value={itbugData.severity}
                      onChange={(e) =>
                        setITBugData({ ...itbugData, severity: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
                  {/* Assignee */}
                  <FormControl>
                    <FormLabel htmlFor="assignee" color="gray.400">
                      Impacted-System (Multi-select)
                    </FormLabel>
                    <Multiselect
                      placeholder="Select an Option"
                      options={[
                        { value: 'active', label: 'Active Days' },
                        { value: 'claims', label: 'Claims' },
                        { value: 'digital', label: 'Digital Health Assesment' },
                      ]}
                      displayValue="label"
                      style={{
                        control: {
                          borderColor: borderColor,
                          backgroundColor: 'white',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          fontSize: '16px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          transition: 'border-color 0.2s ease',
                        },
                        optionContainer: {
                          borderRadius: '8px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          marginTop: '8px',
                          zIndex: 999,
                          backgroundColor: '#f9f9f9',
                          maxHeight: '200px', // Add max height to the dropdown container
                          overflowY: 'auto', // Allow scrolling for overflow
                        },
                        option: {
                          padding: '10px',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          color: '#333',
                          '&:hover': {
                            backgroundColor: '#007bff', // Hover color
                            color: '#fff',
                          },
                          '&:active': {
                            backgroundColor: '#0056b3', // Active color
                            color: '#fff',
                          },
                        },
                        selectedList: {
                          padding: '4px 10px',
                          backgroundColor: '#007bff',
                          borderRadius: '8px',
                          marginRight: '8px',
                          fontSize: '14px',
                          display: 'inline-block',
                          marginBottom: '4px',
                          color: '#fff',
                        },
                        chip: {
                          backgroundColor: '#007bff',
                          fontSize: '14px',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          margin: '2px',
                        },
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="assignee" color="gray.400">
                      Module (Multi-select)
                    </FormLabel>
                    <Multiselect
                      placeholder="Select an Option"
                      options={[
                        { value: 'active', label: 'Active Days' },
                        { value: 'claims', label: 'Claims' },
                        { value: 'digital', label: 'Digital Health Assesment' },
                      ]}
                      displayValue="label"
                      style={{
                        control: {
                          borderColor: borderColor,
                          backgroundColor: 'white',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          fontSize: '16px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          transition: 'border-color 0.2s ease',
                        },
                        optionContainer: {
                          borderRadius: '8px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          marginTop: '8px',
                          zIndex: 999,
                          backgroundColor: '#f9f9f9',
                          maxHeight: '200px', // Add max height to the dropdown container
                          overflowY: 'auto', // Allow scrolling for overflow
                        },
                        option: {
                          padding: '10px',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          color: '#333',
                          '&:hover': {
                            backgroundColor: '#007bff', // Hover color
                            color: '#fff',
                          },
                          '&:active': {
                            backgroundColor: '#0056b3', // Active color
                            color: '#fff',
                          },
                        },
                        selectedList: {
                          padding: '4px 10px',
                          backgroundColor: '#007bff',
                          borderRadius: '8px',
                          marginRight: '8px',
                          fontSize: '14px',
                          display: 'inline-block',
                          marginBottom: '4px',
                          color: '#fff',
                        },
                        chip: {
                          backgroundColor: '#007bff',
                          fontSize: '14px',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          margin: '2px',
                        },
                      }}
                    />
                  </FormControl>
                  </SimpleGrid>
                  <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
                  {/* Assignee */}
                  <FormControl>
                    <FormLabel htmlFor="assignee" color="gray.400">
                      Assignee
                    </FormLabel>
                    <Select
                      id="assignee"
                      value={issueData.assignee}
                      onChange={(e) =>
                        setITBugData({ ...itbugData, assignee: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                    >
                        <option value="" disabled selected>Select an Option</option>
                      <option value="Saurav">Saurav Kumar</option>
                      <option value="Akshita">Akshita Gupta</option>
                      <option value="Om">Om Thange</option>
                     
                    </Select>
                  </FormControl>
                  </SimpleGrid>
                  <SimpleGrid columns={{ sm: 1, md: 1 }} spacing="20px" mb="24px">
                  {/* Assignee */}
                  <FormControl isRequired>
                    <FormLabel htmlFor="actualOutput" color="gray.400">
                     Actual Output
                    </FormLabel>
                    <Textarea
                      id="actualOutput"
                      value={issueData.actualOutput}
                      onChange={(e) =>
                        setIssueData({
                          ...issueData,
                          actualOutput: e.target.value,
                        })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                      resize="none"
                      minHeight="20px"
                    />
                  </FormControl>
                  </SimpleGrid>
                  <SimpleGrid columns={{ sm: 1, md: 1 }} spacing="20px" mb="24px">
                  {/* Assignee */}
                  <FormControl isRequired>
                    <FormLabel htmlFor="expectedOutput" color="gray.400">
                     Expected Output
                    </FormLabel>
                    <Textarea
                      id="expectedOutput"
                      value={issueData.expectedOutput}
                      onChange={(e) =>
                        setIssueData({
                          ...issueData,
                          expectedOutput: e.target.value,
                        })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                      resize="none"
                      minHeight="20px"
                    />
                  </FormControl>
                  </SimpleGrid>
                  <SimpleGrid columns={{ sm: 1, md: 1 }} spacing="20px" mb="24px">
                  {/* Assignee */}
                  <FormControl isRequired>
                    <FormLabel htmlFor="noofTestCases" color="gray.400">
                     Number of Test Cases impacted
                    </FormLabel>
                    <Textarea
                      id="noofTestCases"
                      value={issueData.noofTestCases}
                      onChange={(e) =>
                        setIssueData({
                          ...issueData,
                          noofTestCases: e.target.value,
                        })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor="white"
                      resize="none"
                      minHeight="20px"
                    />
                  </FormControl>
                  </SimpleGrid>
            </>
          )}
          <Flex justifyContent="end" mt="20px">
            <Button
              colorScheme="brandScheme"
              size={['sm', 'md', 'lg']} // Responsive size change
              onClick={handleFormSubmit}
              width={['80%', '60%', '40%', '20%']}
              leftIcon={<Icon as={MdCheckCircle} />}
              _hover={{ backgroundColor: 'brandScheme.500' }}
            >
              Create Issue
            </Button>
          </Flex>
        </Box>
      </Card>
    </Box>
  );
}
