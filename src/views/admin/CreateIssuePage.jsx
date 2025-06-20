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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the default styles
import { MdCheckCircle } from 'react-icons/md';
import Card from 'components/card/Card'; // Your custom Card component
import { useNavigate } from 'react-router-dom';

export default function CreateIssueModal() {
  const [issueData, setIssueData] = useState({
    issueType: '',
    status: 'Open',
    workstreamStreamAndBusinessFunction: '',
    defectType: '',
    productType: '',
    primaryApplication: '',
    summary: '',
    description: '',
    linkedIssue: '',
    severity: '',
    priority: '',
    environment: '',
    impactedSystems: '',
    module: '',
    assignee: '',
    stepsToReproduce: '',
    actualOutput: '',
    expectedOutput: '',
    noOfTestCaseImpacted: '',
    attachment: '',
    crName: '',
    businessOwner: '',
    inScope: '',
    outScope: '',
    businessNeed: '',
    businessNeedBenefitsDetails: '',
    reasonForRaisingChildCR: '',
    parentCR: '',
    biudashboardNeeded: false,
    projectName: '',
    gtmplanNeeded: false,
    justification: ''
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const navigate = useNavigate();
  const masterData = JSON.parse(sessionStorage.getItem("masterData"));
  console.log("Master Data is populated as", masterData)
  const moduleOptions = (masterData?.Module || []).map((mod) => ({
    value: mod,
    label: mod,
  }));
  const workTypeOptions = masterData?.WorkType || [];
  const businessOwnerOptions = masterData?.["Business Owner"] || [];
  const workstreamStreamAndBusinessFunctionOptions = masterData?.["Workstream And Business Function"] || [];
  const priorityOptions = masterData?.Priority || [];
  const severityOptions = masterData?.Severity || [];
  const environmnetOptions = masterData?.Environment || [];
  const defectTypeOptions = masterData?.["Defect Type"] || [];
  const primaryApplicationOptions = masterData?.["Primary Application"] || [];

  // Handling form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/PostIssuedetails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Issue Created Successfully with ID: ${result.issueId}`);
        navigate('/admin/default')
        console.log(result);
      } else {
        toast.error('Submission error');
      }
    } catch (error) {
      toast.error('Network error:', error);
    }
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
  console.log("IssueData", issueData.project)
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>

      <Card
        flexDirection="column"
        w="100%"
        px="60px"
        py="40px"
        mb="20px"
        overflow="auto"
        borderRadius="16px"
        // boxShadow="0 8px 24px rgba(201,20,41,0.3)"
        backgroundColor="white"
      >
        <Box>
          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="6px">
            <FormControl isRequired>
              <FormLabel htmlFor="project" color="gray.400">
                Project
              </FormLabel>
              <Select
                id="projectName"
                value={issueData.projectName}
                onChange={(e) =>
                  setIssueData({ ...issueData, projectName: e.target.value })
                }
                // borderColor="rgb(220,221,222)"
                // color="rgb(201,20,41)"
                // _hover={{ borderColor: 'rgb(247,116,00)' }}
                // _focus={{ borderColor: 'rgb(247,116,00)', boxShadow: '0 0 0 1px rgb(247,116,00)' }}
                // backgroundColor="rgb(255,244,218)"
                borderColor={borderColor}
                backgroundColor={bgColor}
                _hover={{ borderColor: 'brandScheme.400' }}
                _focus={{ borderColor: 'brandScheme.400' }}
              >
                <option value="" disabled>
                  Select an Option
                </option>
                <option value="ABHI Change Request Management">
                  ABHI Change Request Management
                </option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="issueType" color="gray.400">
                Issue Type
              </FormLabel>
              <Select
                id="issueType"
                value={issueData.issueType}
                onChange={(e) =>
                  setIssueData({ ...issueData, issueType: e.target.value })
                }
                borderColor={borderColor}
                backgroundColor={bgColor}
                _hover={{ borderColor: 'brandScheme.400' }}
                _focus={{ borderColor: 'brandScheme.400' }}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {workTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </FormControl>
          </SimpleGrid>
          {issueData.projectName === 'ABHI Change Request Management' &&
            (issueData.issueType === 'Change Request' ||
              issueData.issueType === 'Project' ||
              issueData.issueType === 'BAU Project' || issueData.issueType === 'Service Request'
              || issueData.issueType === 'Epic'
            ) && (
              <>
                <SimpleGrid columns={{ sm: 1, md: 1 }} spacing="20px" mb="24px">
                  {/* Issue Type */}
                  {/* <FormControl isRequired>
                    <FormLabel htmlFor="issueType" color="gray.400">
                      Project/CR Name
                    </FormLabel>
                    <Textarea
                      id="projectName"
                      value={issueData.projectName}
                      onChange={(e) =>
                        setIssueData({
                          ...issueData,
                          projectName: e.target.value,
                        })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor={bgColor}
                      resize="none"
                      minHeight="20px"
                    />
                  </FormControl> */}
                </SimpleGrid>

                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
                  <FormControl isRequired>
                    <FormLabel htmlFor="severity" color="gray.400">
                      Business owner
                    </FormLabel>
                    <Select
                      id="severity"
                      value={issueData.businessOwner}
                      onChange={(e) =>
                        setIssueData({ ...issueData, businessOwner: e.target.value })
                      }
                      borderColor={borderColor}
                      backgroundColor={bgColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}

                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {businessOwnerOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
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
                      backgroundColor={bgColor}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {priorityOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
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
                      id="summary"
                      value={issueData.summary}
                      onChange={(e) =>
                        setIssueData({
                          ...issueData,
                          summary: e.target.value,
                        })
                      }
                      borderColor={borderColor}

                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor={bgColor}
                      resize="none"
                      minHeight="20px"
                    />
                  </FormControl>
                </SimpleGrid>
                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
                  <FormControl isRequired>
                    <FormLabel htmlFor="issueDescription" color="gray.400">
                      Description
                    </FormLabel>
                    <Textarea
                      id="description"
                      value={issueData.description}
                      onChange={(e) =>
                        setIssueData({
                          ...issueData,
                          description: e.target.value,
                        })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor={bgColor}
                      placeholder="Describe the issue in detail..."
                      resize="none"
                      minHeight="150px"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="tags" color="gray.400">
                      Business Need Benefits details calculation (Tangible and
                      intangible benefits)
                    </FormLabel>
                    <Textarea
                      id="businessNeedBenefitsDetails"
                      value={issueData.businessNeedBenefitsDetails}
                      onChange={(e) =>
                        setIssueData({
                          ...issueData,
                          businessNeedBenefitsDetails: e.target.value,
                        })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor={bgColor}
                      resize="none"
                      minHeight="90px"
                    />
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
                      backgroundColor={bgColor}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="workstream" color="gray.400">
                      WorkStream and Business Function
                    </FormLabel>
                    <Select
                      id="workstreamStreamAndBusinessFunction"
                      value={issueData.workstreamStreamAndBusinessFunction}
                      onChange={(e) =>
                        setIssueData({ ...issueData, workstreamStreamAndBusinessFunction: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor={bgColor}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {workstreamStreamAndBusinessFunctionOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
                  {/* Assignee */}
                  <FormControl>
                    <FormLabel htmlFor="module" color="gray.400">
                      Module (Multi-select)
                    </FormLabel>
                    <Multiselect
                      placeholder="Select an Option"
                      options={moduleOptions}
                      displayValue="label"
                      selectedValues={
                        issueData.module
                          ? issueData.module.split(',').map((val) => ({
                            value: val,
                            label: val,
                          }))
                          : []
                      }
                      onSelect={(selectedList) =>
                        setIssueData({
                          ...issueData,
                          module: selectedList.map((item) => item.value).join(','),
                        })
                      }
                      onRemove={(selectedList) =>
                        setIssueData({
                          ...issueData,
                          module: selectedList.map((item) => item.value).join(','),
                        })
                      }
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
                          maxHeight: '200px',
                          overflowY: 'auto',
                        },
                        option: {
                          padding: '10px',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          color: '#333',
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
                  {/* Assignee */}
                  <FormControl>
                    <FormLabel htmlFor="businessNeed" color="gray.400">
                      Business Need (Multi-select)
                    </FormLabel>
                    <Multiselect
                      placeholder="Select an Option"
                      options={[
                        { value: 'Audit Observation', label: 'Audit Observation' },
                        { value: 'Cost Reduction/Avoidence', label: 'Cost Reduction/Avoidence' },
                        { value: 'Customer Experience', label: 'Customer Experience' },
                        { value: 'Customer OnBoarding', label: 'Customer OnBoarding' },
                        { value: 'Distributor Experience', label: 'Distributor Experience' },
                        { value: 'Employee Experience', label: 'Employee Experience' },
                        { value: 'Operation Efficiency', label: 'Operation Efficiency' },
                        { value: 'Partner On-Boarding', label: 'Partner On-Boarding' },
                        { value: 'Regulatory', label: 'Regulatory' },
                        { value: 'Revenue Generation', label: 'Revenue Generation' },
                        { value: 'Risk Management', label: 'Risk Management' },
                        { value: 'Tech Scalability', label: 'Tech Scalability' },
                      ]}
                      displayValue="label"
                      selectedValues={
                        issueData.businessNeed
                          ? issueData.businessNeed.split(',').map((val) => {
                            const option = [
                              { value: 'audit', label: 'Audit Observation' },
                              { value: 'cost', label: 'Cost Reduction/Avoidence' },
                              { value: 'customer', label: 'Customer Experience' },
                              { value: 'customer On_boarding', label: 'Customer OnBoarding' },
                              { value: 'distributor', label: 'Distributor Experience' },
                              { value: 'employee', label: 'Employee Experience' },
                              { value: 'operation', label: 'Operation Efficiency' },
                              { value: 'partner', label: 'Partner On-Boarding' },
                              { value: 'regulatory', label: 'Regulatory' },
                              { value: 'revenue', label: 'Revenue Generation' },
                              { value: 'risk management', label: 'Risk Management' },
                              { value: 'tech', label: 'Tech Scalability' },
                            ].find((o) => o.value === val);
                            return option || { value: val, label: val };
                          })
                          : []
                      }
                      onSelect={(selectedList) =>
                        setIssueData({
                          ...issueData,
                          businessNeed: selectedList.map((item) => item.value).join(','),
                        })
                      }
                      onRemove={(selectedList) =>
                        setIssueData({
                          ...issueData,
                          businessNeed: selectedList.map((item) => item.value).join(','),
                        })
                      }
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
                          maxHeight: '200px',
                          overflowY: 'auto',
                        },
                        option: {
                          padding: '10px',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          color: '#333',
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

                  {/* <FormControl>
                    <FormLabel htmlFor="tags" color="gray.400">
                      Business Need Benefits details calculation (Tangible and
                      intangible benefits)
                    </FormLabel>
                    <Textarea
                      id="businessNeedBenefitsDetails"
                      value={issueData.businessNeedBenefitsDetails}
                      onChange={(e) =>
                        setIssueData({
                          ...issueData,
                          businessNeedBenefitsDetails: e.target.value,
                        })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor={bgColor}
                      resize="none"
                      minHeight="90px"
                    />
                  </FormControl> */}
                </SimpleGrid>
              </>
            )}
          {issueData.projectName === 'ABHI Change Request Management' && issueData.issueType === 'Bug' && (
            <>
              <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
                {/* Issue Type */}
                <FormControl isRequired>
                  <FormLabel htmlFor="issueType" color="gray.400">
                    Workstream and BusinessFunction
                  </FormLabel>
                  <Select
                    id="workstreamStreamAndBusinessFunction"
                    value={issueData.workstreamStreamAndBusinessFunction}
                    onChange={(e) =>
                      setIssueData({ ...issueData, workstreamStreamAndBusinessFunction: e.target.value })
                    }
                    borderColor={borderColor}
                    _hover={{ borderColor: 'brandScheme.400' }}
                    _focus={{ borderColor: 'brandScheme.400' }}
                    backgroundColor={bgColor}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {workstreamStreamAndBusinessFunctionOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                {/* Issue Type */}
                <FormControl isRequired>
                  <FormLabel htmlFor="issueType" color="gray.400">
                    Defect Type
                  </FormLabel>
                  <Select
                    id="defectType"
                    value={issueData.defectType}
                    onChange={(e) =>
                      setIssueData({ ...issueData, defectType: e.target.value })
                    }
                    borderColor={borderColor}
                    _hover={{ borderColor: 'brandScheme.400' }}
                    _focus={{ borderColor: 'brandScheme.400' }}
                    backgroundColor={bgColor}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {defectTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
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
                    value={issueData.primaryApplication}
                    onChange={(e) =>
                      setIssueData({
                        ...issueData,
                        primaryApplication: e.target.value,
                      })
                    }
                    borderColor={borderColor}
                    _hover={{ borderColor: 'brandScheme.400' }}
                    _focus={{ borderColor: 'brandScheme.400' }}
                    backgroundColor={bgColor}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {primaryApplicationOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                {/* Issue Type */}
                <FormControl isRequired>
                  <FormLabel htmlFor="issueType" color="gray.400">
                    Summary
                  </FormLabel>
                  <Textarea
                    id="summary"
                    value={issueData.summary}
                    onChange={(e) =>
                      setIssueData({
                        ...issueData,
                        summary: e.target.value,
                      })
                    }
                    borderColor={borderColor}
                    _hover={{ borderColor: 'brandScheme.400' }}
                    _focus={{ borderColor: 'brandScheme.400' }}
                    backgroundColor={bgColor}
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
                    id="description"
                    value={issueData.description}
                    onChange={(e) =>
                      setIssueData({
                        ...issueData,
                        description: e.target.value,
                      })
                    }
                    borderColor={borderColor}
                    _hover={{ borderColor: 'brandScheme.400' }}
                    _focus={{ borderColor: 'brandScheme.400' }}
                    backgroundColor={bgColor}
                    placeholder="Describe the defect in detail..."
                    resize="none"
                    minHeight="150px"
                  />
                </FormControl>
              </SimpleGrid>
              {/* <SimpleGrid columns={{ sm: 1, md: 1 }} spacing="20px" mb="24px">
              <FormControl isRequired>
  <FormLabel htmlFor="linkedIssue" color="gray.400">
    Linked Issue
  </FormLabel>
  <Multiselect
    placeholder="Select an Option"
    options={[
      { value: 'IT-7886', label: 'IT-7886' },
      { value: 'claims', label: 'Claims' },
      { value: 'digital', label: 'Digital Health Assessment' },
    ]}
    displayValue="label"
    selectedValues={
      issueData.linkedIssue
        ? issueData.linkedIssue.split(',').map((val) => {
            const option = [
              { value: 'IT-7886', label: 'IT-7886' },
              { value: 'claims', label: 'Claims' },
              { value: 'digital', label: 'Digital Health Assessment' },
            ].find((o) => o.value === val);
            return option || { value: val, label: val };
          })
        : []
    }
    onSelect={(selectedList) =>
      setIssueData({
        ...issueData,
        linkedIssue: selectedList.map((item) => item.value).join(','),
      })
    }
    onRemove={(selectedList) =>
      setIssueData({
        ...issueData,
        linkedIssue: selectedList.map((item) => item.value).join(','),
      })
    }
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
        maxHeight: '200px',
        overflowY: 'auto',
      },
      option: {
        padding: '10px',
        fontSize: '14px',
        backgroundColor: 'white',
        borderRadius: '8px',
        color: '#333',
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

              </SimpleGrid> */}
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
                    backgroundColor={bgColor}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {priorityOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="severity" color="gray.400">
                    Severity
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
                    backgroundColor={bgColor}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {severityOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
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
                    value={issueData.environment}
                    onChange={(e) =>
                      setIssueData({ ...issueData, environment: e.target.value })
                    }
                    borderColor={borderColor}
                    _hover={{ borderColor: 'brandScheme.400' }}
                    _focus={{ borderColor: 'brandScheme.400' }}
                    backgroundColor={bgColor}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {environmnetOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                {/* <FormControl isRequired>
                    <FormLabel htmlFor="severity" color="gray.400">
                    Severity
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
                      backgroundColor={bgColor}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </Select>
                  </FormControl> */}
              </SimpleGrid>
              <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
                {/* Assignee */}
                <FormControl isRequired>
                  <FormLabel htmlFor="impactedSystems" color="gray.400">
                    Impacted-System (Multi-select)
                  </FormLabel>
                  <Multiselect
                    placeholder="Select an Option"
                    options={[
                      { value: 'active', label: 'Active Days' },
                      { value: 'claims', label: 'Claims' },
                      { value: 'Digital', label: 'Digital Health Assessment' },
                    ]}
                    displayValue="label"
                    selectedValues={
                      issueData.impactedSystems
                        ? issueData.impactedSystems.split(',').map((val) => {
                          const option = [
                            { value: 'Active', label: 'Active Days' },
                            { value: 'Claims', label: 'Claims' },
                            { value: 'Digital', label: 'Digital Health Assessment' },
                          ].find((o) => o.value === val);
                          return option || { value: val, label: val };
                        })
                        : []
                    }
                    onSelect={(selectedList) =>
                      setIssueData({
                        ...issueData,
                        impactedSystems: selectedList.map((item) => item.value).join(','),
                      })
                    }
                    onRemove={(selectedList) =>
                      setIssueData({
                        ...issueData,
                        impactedSystems: selectedList.map((item) => item.value).join(','),
                      })
                    }
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
                        maxHeight: '200px',
                        overflowY: 'auto',
                      },
                      option: {
                        padding: '10px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        color: '#333',
                        '&:hover': {
                          backgroundColor: '#007bff',
                          color: '#fff',
                        },
                        '&:active': {
                          backgroundColor: '#0056b3',
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
                  <FormLabel htmlFor="module" color="gray.400">
                    Module (Multi-select)
                  </FormLabel>
                  <Multiselect
                    placeholder="Select an Option"
                    options={moduleOptions}
                    displayValue="label"
                    selectedValues={
                      issueData.module
                        ? issueData.module.split(',').map((val) => ({
                          value: val,
                          label:
                            val === 'active'
                              ? 'Active Days'
                              : val === 'claims'
                                ? 'Claims'
                                : 'Digital Health Assessment',
                        }))
                        : []
                    }
                    onSelect={(selectedList) =>
                      setIssueData({
                        ...issueData,
                        module: selectedList.map((item) => item.value).join(','),
                      })
                    }
                    onRemove={(selectedList) =>
                      setIssueData({
                        ...issueData,
                        module: selectedList.map((item) => item.value).join(','),
                      })
                    }
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
                        maxHeight: '200px',
                        overflowY: 'auto',
                      },
                      option: {
                        padding: '10px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        color: '#333',
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
                      setIssueData({ ...issueData, assignee: e.target.value })
                    }
                    borderColor={borderColor}
                    _hover={{ borderColor: 'brandScheme.400' }}
                    _focus={{ borderColor: 'brandScheme.400' }}
                    backgroundColor={bgColor}
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
                    backgroundColor={bgColor}
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
                    backgroundColor={bgColor}
                    resize="none"
                    minHeight="20px"
                  />
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={{ sm: 1, md: 1 }} spacing="20px" mb="24px">
                {/* Assignee */}
                <FormControl isRequired>
                  <FormLabel htmlFor="noOfTestCaseImpacted" color="gray.400">
                    Number of Test Cases impacted
                  </FormLabel>
                  <Textarea
                    id="noOfTestCaseImpacted"
                    value={issueData.noOfTestCaseImpacted}
                    onChange={(e) =>
                      setIssueData({
                        ...issueData,
                        noOfTestCaseImpacted: e.target.value,
                      })
                    }
                    borderColor={borderColor}
                    _hover={{ borderColor: 'brandScheme.400' }}
                    _focus={{ borderColor: 'brandScheme.400' }}
                    backgroundColor={bgColor}
                    resize="none"
                    minHeight="20px"
                  />
                </FormControl>
              </SimpleGrid>
            </>
          )}
          <Flex justifyContent="end" mt="20px">
            <Button
              size={['sm', 'md', 'lg']}
              onClick={handleFormSubmit}
              width={['80%', '60%', '40%', '20%']}
              leftIcon={<Icon as={MdCheckCircle} />}
              bg="rgb(201,20,41)"
              color="white"
              fontWeight="bold"
              borderRadius="12px"
              boxShadow="0 4px 12px rgba(201,20,41,0.6)"
              _hover={{ backgroundColor: 'rgb(141,18,24)', boxShadow: '0 6px 16px rgba(141,18,24,0.8)' }}
              _active={{ backgroundColor: 'rgb(141,18,24)', boxShadow: '0 2px 8px rgba(141,18,24,0.8)' }}
              transition="background-color 0.3s ease, box-shadow 0.3s ease"
            >
              Create Issue
            </Button>
          </Flex>
        </Box>
      </Card>
    </Box>
  );
}