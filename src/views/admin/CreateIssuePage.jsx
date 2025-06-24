import React, { useState,useCallback } from 'react';
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
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  List,
  ListItem,

} from '@chakra-ui/react';
import Multiselect from 'multiselect-react-dropdown';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the default styles
import { MdCheckCircle } from 'react-icons/md';
import Card from 'components/card/Card'; // Your custom Card component
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
export default function CreateIssueModal() {
const [issueData, setIssueData] = useState({
  issueType: '',
  status: 'Open',
  workStreamAndBusinessFunction: '',
  workStreamAndBusinessSubFunction: [],
  primaryApplication: '',
  summary: '',
  description: '',
  priority: '',
  impactedSystems: '',
  module: '',
  assignee: '',
  reporter: '', // 🔹 NEW
  severity: '',
  defectType: '',
  productType: '',
  environment: '',
  stepsToReproduce: '',
  actualOutput: '',
  expectedOutput: '',
  noOfTestCaseImpacted: '',
  attachments: [], // 🔹 NEW (was 'attachment')
  linkedIssue: '',
  crName: '',
  businessOwner: '',
  inScope: '',
  outScope: '',
  businessNeed: '',
  businessNeedBenefitsDetails: '',
  reasonForRaisingChildCR: '',
  parentCR: '',
  biudashboardNeeded: false,
  gtmplanNeeded: false,
  justification: '',
  projectName: '',
  qualitativeBenefits: '',
  quantitativeBenefitType: '',
  quantitativeBenefitValue: '',
  quantitativeBenefits: '',
  labels: null, // 🔹 NEW
  brdReviewedInternally: false, // 🔹 NEW
  qaTestingEffortsHours: null, // 🔹 NEW
  partnerName: null, // 🔹 NEW
  impactedBusinessFunction: null, // 🔹 NEW
  primaryBA: null, // 🔹 NEW
  secondaryBA: null, // 🔹 NEW
  complexity: null, // 🔹 NEW
  exComPriority: null // 🔹 NEW
});

  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const navigate = useNavigate();
  const masterData = JSON.parse(sessionStorage.getItem("masterData"));
    const userData = JSON.parse(sessionStorage.getItem("userData"));
  console.log("userData", userData);
  const username = userData.username
  console.log("Master Data is populated as", masterData)
  const moduleOptions = (masterData?.Module || []).map((mod) => ({
    value: mod,
    label: mod,
  }));
  const workTypeOptions = masterData?.WorkType || [];
  const businessOwnerOptions = masterData?.["Business Owner"] || [];
  const businessNeedOptions = masterData?.["Business Need"] || [];
  const priorityOptions = masterData?.Priority || [];
  const severityOptions = masterData?.Severity || [];
  const environmnetOptions = masterData?.Environment || [];
  const defectTypeOptions = masterData?.["Defect Type"] || [];
  const qualitativeBenefitsOptions = masterData?.["Qualitative Benefit"] || [];
  const quantitativeBenefitsOptions = masterData?.["Quantitative Benefit"] || [];
  const primaryApplicationOptions = masterData?.["Primary Application"] || [];
  const [businessFunctions, setBusinessFunctions] = useState([]);
  const [subFunctions, setSubFunctions] = useState([]);
  const [modules, setModules] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState('');
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedBusinessFunction, setSelectedBusinessFunction] = useState("");
  const [selectedSubFunction, setSelectedSubFunction] = useState("");
  console.log("Business Need is",businessNeedOptions)

const [documents, setDocuments] = useState([{ type: "", file: null, base64: "" }]);
  const handleFormSubmit = async (e) => {
  e.preventDefault();
  const isDefect = issueData.issueType === 'Defect';
  const apiUrl = isDefect
    ? 'http://localhost:8080/api/bugs/PostBugDetails'
    : 'http://localhost:8080/api/PostIssuedetails';

  // Filter payload based on type
  const payload = isDefect
    ? {
      // issueType: issueData.issueType,
        projectName: issueData.projectName,
        workType: issueData.issueType,
        status: issueData.status,
        workStreamAndBusinessFunction: issueData.workStreamAndBusinessFunction,
        summary: issueData.summary,
        description: issueData.description,
        module: issueData.module,
        assignee: issueData.assignee,
        priority: issueData.priority,
        attachments: issueData.attachments,
        reporter: issueData.reporter,
        primaryApplication: issueData.primaryApplication,
        impactedSystems: issueData.impactedSystems,
        defectType: issueData.defectType,
        productType: issueData.productType,
        severity: issueData.severity,
        environment: issueData.environment,
        stepsToReproduce: issueData.stepsToReproduce,
        actualOutput: issueData.actualOutput,
        expectedOutput: issueData.expectedOutput,
        noOfTestCaseImpacted: issueData.noOfTestCaseImpacted,
        parentCR: issueData.parentCR
      }
    : {
        issueType: issueData.issueType,
        status: issueData.status,
        workStreamAndBusinessFunction: issueData.workStreamAndBusinessFunction,
        workStreamAndBusinessSubFunction: issueData.workStreamAndBusinessSubFunction,
        primaryApplication: issueData.primaryApplication,
        summary: issueData.summary,
        description: issueData.description,
        priority: issueData.priority,
        impactedSystems: issueData.impactedSystems,
        module: issueData.module,
        assignee: issueData.assignee,
        reporter: issueData.reporter,
        crName: issueData.crName,
        businessOwner: issueData.businessOwner,
        businessNeed: issueData.businessNeed,
        brdReviewedInternally: issueData.brdReviewedInternally,
        qaTestingEffortsHours: issueData.qaTestingEffortsHours,
        partnerName: issueData.partnerName,
        impactedBusinessFunction: issueData.impactedBusinessFunction,
        primaryBA: issueData.primaryBA,
        complexity: issueData.complexity,
        secondaryBA: issueData.secondaryBA,
        exComPriority: issueData.exComPriority,
        attachments: issueData.attachments,
        labels: issueData.labels,
        justification: issueData.justification,
        projectName: issueData.projectName,
        qualitativeBenefits: issueData.qualitativeBenefits,
        quantitativeBenefitType: issueData.quantitativeBenefitType,
        quantitativeBenefitValue: issueData.quantitativeBenefitValue,
        quantitativeBenefits: issueData.quantitativeBenefits
      };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      toast.success(`Issue Created Successfully with ID: ${result.issueId}`);
      navigate('/admin/default');
      console.log(result);
    } else {
      toast.error('Submission error');
    }
  } catch (error) {
    toast.error('Network error');
    console.error('Network error:', error);
  }
};

const fetchIssues = async (searchText) => {
  try {
    const response = await axios.get('http://localhost:8080/api/GetIssuedetails');
    const allIssues = response.data;
    const filtered = allIssues.filter((issue) =>
      issue.issueId.toLowerCase().includes(searchText.toLowerCase())
    );
    setSuggestions(filtered.map((issue) => issue.issueId));
  } catch (error) {
    console.error('Error fetching issues:', error);
  }
};

const debouncedSearch = useCallback(
  debounce((value) => {
    if (value.trim()) fetchIssues(value);
    else setSuggestions([]);
  }, 300),
  []
);

const handleChange = (e) => {
  const value = e.target.value;
  setQuery(value);
  setIssueData({ ...issueData, parentCR: value });
  debouncedSearch(value);
};

const handleSuggestionClick = (suggestion) => {
  setIssueData({ ...issueData, parentCR: suggestion });
  setQuery(suggestion);
  setSuggestions([]);
};
  
  const handleFileChange = (index, file) => {
  const updatedDocs = [...documents];
  updatedDocs[index].file = file;

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64 = reader.result.split(",")[1];
    updatedDocs[index].base64 = base64;
    setDocuments(updatedDocs);

    // Generate the formatted attachments array
    const attachmentPayload = updatedDocs
      .filter(doc => doc.file && doc.type) // Only include valid entries
      .map((doc) => ({
        filename: doc.file.name,
        uploadedBy:username, // Replace dynamically if needed
        uploadedTimestamp: new Date().toISOString(),
        filedata: doc.base64,
        documentType: doc.type,
      }));

    setIssueData(prev => ({
      ...prev,
      attachments: attachmentPayload
    }));
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};
const handleTypeChange = (index, value) => {
    const updatedDocs = [...documents];
    updatedDocs[index].type = value;
    setDocuments(updatedDocs);
  };
const addRow = () => {
  setDocuments([...documents, { type: "", file: null, base64: "" }]);
};
const removeRow = (index) => {
  const updatedDocs = documents.filter((_, i) => i !== index);
  setDocuments(updatedDocs);

  const attachmentPayload = updatedDocs
    .filter(doc => doc.file && doc.type)
    .map((doc) => ({
      filename: doc.file.name,
      uploadedBy: username,
      uploadedTimestamp: new Date().toISOString(),
      filedata: doc.base64,
      documentType: doc.type,
    }));

  setIssueData(prev => ({
    ...prev,
    attachments: attachmentPayload
  }));
};

  useEffect(() => {
    // Fetch business functions when the component mounts
    const fetchBusinessFunctions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/master/businessFunction');
        console.log("Response for business function is",response.data);
        setBusinessFunctions(response.data);
      } catch (error) {
        console.error('Error fetching business functions:', error);
      }
    };
    
    fetchBusinessFunctions();
  }, []);
  
  // Update subfunctions based on the selected business function
  useEffect(() => {
    const business = businessFunctions.find(
      (bf) => bf.businessFunction === issueData.workStreamAndBusinessFunction
    );
  console.log("Business is ",issueData.workStreamAndBusinessFunction)
    if (business) {
      setSubFunctions(business.subFunctions|| []);
      setSelectedSubFunction(""); // Reset subfunction when business function changes
      setModules([]); // Reset modules when subfunction changes
    }
  }, [issueData.workStreamAndBusinessFunction, businessFunctions]);
  
  
  // Update modules based on selected subfunction
  useEffect(() => {
    if (issueData.workStreamAndBusinessSubFunction) {
      const subFunctionData = subFunctions.find(sub => sub.name === issueData.workStreamAndBusinessSubFunction);
      if (subFunctionData) {
        setModules([subFunctionData.module]); // Set module from the subfunction's module
        setIssueData({
          ...issueData,
          module: subFunctionData.module,
        });
      }
    }
  }, [issueData.workStreamAndBusinessSubFunction, subFunctions]);
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
  useEffect(() => {
    axios.get('http://localhost:8080/api/User/GetUserDetails')
      .then((res) => {
        setAllUsers(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch users', err);
      });
  }, []);

  // Filter usernames when input changes
  useEffect(() => {
    if (issueData.assignee.trim() === '') {
      setUserSuggestions([]);
    } else {
      const filtered = allUsers.filter((user) =>
        user.username.toLowerCase().includes(issueData.assignee.toLowerCase())
      );
      setUserSuggestions(filtered);
    }
  }, [issueData.assignee, allUsers]);

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
                id="projectName"
                value={issueData.projectName}
                onChange={(e) =>
                  setIssueData({ ...issueData, projectName: e.target.value })
                }
                borderColor={borderColor}
                textColor={textColor}
                _hover={{ borderColor: 'brandScheme.400' }}
                _focus={{ borderColor: 'brandScheme.400' }}
                backgroundColor={bgColor}
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
                _hover={{ borderColor: 'brandScheme.400' }}
                _focus={{ borderColor: 'brandScheme.400' }}
                backgroundColor={bgColor}
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
                <SimpleGrid columns={{ sm: 1, md: 1 }} spacing="20px" mb="24px">
                  <FormControl isRequired>
                    <FormLabel htmlFor="description" color="gray.400">
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

                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
                <FormControl position="relative">
      <FormLabel htmlFor="assignee" color="gray.400">Assignee</FormLabel>
      <Input
        id="assignee"
        value={issueData.assignee}
        onChange={(e) =>
          setIssueData({ ...issueData, assignee: e.target.value })
        }
        borderColor="gray.300"
        _hover={{ borderColor: 'brandScheme.400' }}
        _focus={{ borderColor: 'brandScheme.400' }}
        backgroundColor="white"
        autoComplete="off"
      />
      {userSuggestions.length > 0 && (
        <Box mt={1} border="1px solid" borderColor="gray.200" borderRadius="md" maxHeight="200px" overflowY="auto" bg="white" zIndex={10} position="absolute">
          <List spacing={1}>
            {userSuggestions.map((user) => (
              <ListItem
                key={user.id}
                px={3}
                py={1}
                _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                onClick={() => {
                  setIssueData({ ...issueData, assignee: user.username });
                  setUserSuggestions([]);
                }}
              >
                {user.username}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="workstream" color="gray.400">
                      WorkStream and Business Function
                    </FormLabel>
                    <Select
                      id="workStreamAndBusinessFunction"
                      value={issueData.workStreamAndBusinessFunction}
                      onChange={(e) =>
                        setIssueData({ ...issueData, workStreamAndBusinessFunction: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor={bgColor}
                    >
                      <option value="">Select Business Function</option>
        {businessFunctions.map((item) => (
          <option key={item.businessFunction} value={item.businessFunction}>
            {item.businessFunction}
          </option>
        ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
                  {/* Assignee */}
                  {issueData.workStreamAndBusinessFunction && 
                  <FormControl>
                    <FormLabel htmlFor="workstream" color="gray.400">
                      SubFunction
                    </FormLabel>
                    <Select
                      id="workStreamAndBusinessSubFunction"
                      value={issueData.workStreamAndBusinessSubFunction}
                      onChange={(e) =>
                        setIssueData({ ...issueData, workStreamAndBusinessSubFunction: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor={bgColor}
                    >
                      <option value="">Select Subfunction</option>
        {subFunctions.map((item) => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))}
                    </Select>
                  </FormControl>
}
                  <FormControl>
                    <FormLabel htmlFor="workstream" color="gray.400">
                      Module
                    </FormLabel>
                    <Select
                    disabled={!selectedSubFunction}
                      id="module"
                      value={issueData.module}
                      onChange={(e) =>
                        setIssueData({ ...issueData, module: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor={bgColor}
                    >
                       <option value="">Select Module</option>
        {modules.map((module) => (
          <option key={module} value={module}>
            {module}
          </option>
        ))}
                    </Select>
                  </FormControl>

                </SimpleGrid>
                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
                  {/* Assignee */}
                  <FormControl>
  <FormLabel htmlFor="businessNeed" color="gray.400">
    Business Need (Multi-select)
  </FormLabel>
  <Multiselect
    placeholder="Select an Option"
    options={businessNeedOptions.map((need) => ({ value: need, label: need }))}  // Dynamically map the options
    displayValue="label"
    selectedValues={issueData.businessNeed
      ? issueData.businessNeed.split(',').map((val) => {
          return { value: val, label: val }; // Map CSV back to the object format
        })
      : []}
    onSelect={(selectedList) =>
      setIssueData({
        ...issueData,
        businessNeed: selectedList.map((item) => item.value).join(','),  // Join the selected values into a CSV string
      })
    }
    onRemove={(selectedList) =>
      setIssueData({
        ...issueData,
        businessNeed: selectedList.map((item) => item.value).join(','),  // Same for remove
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


                  <FormControl isRequired>
                    <FormLabel htmlFor="priority" color="gray.400">
                    Qualitative Benefit
                    </FormLabel>
                    <Select
                      id="qualitativeBenefits"
                      value={issueData.qualitativeBenefits}
                      onChange={(e) =>
                        setIssueData({ ...issueData, qualitativeBenefits: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor={bgColor}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {qualitativeBenefitsOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel htmlFor="priority" color="gray.400">
                    Quantitative Benefit
                    </FormLabel>
                    <Select
                      id="quantitativeBenefits"
                      value={issueData.quantitativeBenefits}
                      onChange={(e) =>
                        setIssueData({ ...issueData, quantitativeBenefits: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor={bgColor}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {quantitativeBenefitsOptions.map((type) => (
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
                    <FormLabel htmlFor="workstream" color="gray.400">
                      Quantitative Benefit Type
                    </FormLabel>
                    <Select
                      id="quantitativeBenefitType"
                      value={issueData.quantitativeBenefitType}
                      onChange={(e) =>
                        setIssueData({ ...issueData, quantitativeBenefitType: e.target.value })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor={bgColor}
                    >
                      <option value="">Select % or Value</option>
        
          <option value="percentage">
            %
          </option>
          <option value="value">
            value
          </option>
        
                    </Select>
                  </FormControl>

                  <FormControl>
                  <FormLabel htmlFor="quantitativeBenefitValue" color="gray.400">
                      Value or Percentage
                    </FormLabel>
                    <Textarea
                      id="quantitativeBenefitValue"
                      value={issueData.quantitativeBenefitValue}
                      onChange={(e) =>
                        setIssueData({
                          ...issueData,
                          quantitativeBenefitValue: e.target.value,
                        })
                      }
                      borderColor={borderColor}
                      _hover={{ borderColor: 'brandScheme.400' }}
                      _focus={{ borderColor: 'brandScheme.400' }}
                      backgroundColor={bgColor}
                      placeholder="Describe the issue in detail..."
                      resize="none"
                      minHeight="10px"
                    />
                  </FormControl>
  <Box gridColumn="1 / -1">
    <FormLabel color="gray.600" fontWeight="bold">Document Upload</FormLabel>
    <Table variant="simple" size="sm">
      <Thead>
        <Tr>
          <Th>Document Type</Th>
          <Th>Document Upload</Th>
        </Tr>
      </Thead>
      <Tbody>
        {documents.map((doc, index) => (
          <Tr key={index}>
            <Td>
              <Select
                placeholder="Choose"
                value={doc.type}
                onChange={(e) => handleTypeChange(index, e.target.value)}
              >
                <option value="BRD">BRD</option>
                <option value="Design">Design</option>
                <option value="Testing">Testing</option>
              </Select>
            </Td>
            <Td>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFileChange(index, e.target.files[0])
                }
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
    <Button mt={2} size="sm" onClick={addRow}>
      + Add
    </Button>
  </Box>
                </SimpleGrid>
              </>
            )}
          {issueData.projectName === 'ABHI Change Request Management' && issueData.issueType === 'Defect' && (
            <>
              <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
                {/* Issue Type */}
                <FormControl isRequired>
                  <FormLabel htmlFor="issueType" color="gray.400">
                    Workstream and BusinessFunction
                  </FormLabel>
                  <Select
                    id="workStreamAndBusinessFunction"
                    value={issueData.workStreamAndBusinessFunction}
                    onChange={(e) =>
                      setIssueData({ ...issueData, workStreamAndBusinessFunction: e.target.value })
                    }
                    borderColor={borderColor}
                    _hover={{ borderColor: 'brandScheme.400' }}
                    _focus={{ borderColor: 'brandScheme.400' }}
                    backgroundColor={bgColor}
                  >
                      <option value="">Select Business Function</option>
        {businessFunctions.map((item) => (
          <option key={item.businessFunction} value={item.businessFunction}>
            {item.businessFunction}
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
              <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" mb="24px">
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
               
<FormControl isRequired>
      <FormLabel htmlFor="parentCR" color="gray.400">
        Linked Issues
      </FormLabel>
      <Textarea
        id="parentCR"
        value={query}
        onChange={handleChange}
        borderColor={borderColor}
        _hover={{ borderColor: 'brandScheme.400' }}
        _focus={{ borderColor: 'brandScheme.400' }}
        backgroundColor={bgColor}
        resize="none"
        minHeight="20px"
      />
      {suggestions.length > 0 && (
        <Box
          mt="1"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          maxH="150px"
          overflowY="auto"
          backgroundColor="white"
          zIndex="1"
          position="absolute"
          width="100%"
        >
          <List spacing={1}>
            {suggestions.map((s, idx) => (
              <ListItem
                key={idx}
                px={3}
                py={2}
                _hover={{ backgroundColor: 'gray.100', cursor: 'pointer' }}
                onClick={() => handleSuggestionClick(s)}
              >
                {s}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
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