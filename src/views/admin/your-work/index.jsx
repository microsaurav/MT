import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Editable,
  EditableInput,
  EditablePreview,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  PopoverHeader,
  PopoverBody,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
  VStack,
  Text,
  Avatar,
  HStack, Divider,
  Tag,
  Icon,
} from "@chakra-ui/react";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Popup from '../WorkflowPopupp';
import SubtaskPopup from '../SubtaskPopup';
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu"
import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ArrowRightIcon } from "lucide-react"; // optional icon
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the default styles
export default function Overview() {

  const [rows, setRows] = useState([]);
  const [rowsLinkIssue, setRowsLinkIssue] = useState([]);

  const [message, setMessage] = useState("Open");
  const [status, setStatus] = useState(""); // current status
  const [transitionOptions, setTransitionOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // control showing select

  const [transitionFields, setTransitionFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [isTransitionPopupOpen, setIsTransitionPopupOpen] = useState(false);
  const [transitionPopupData, setTransitionPopupData] = useState(null);
  const [transitionFormData, setTransitionFormData] = useState({});
  const addRow = () => {
    setRows([...rows, { value: "please add details", selectValue: "Option1" }]);
  };

  const addRowLinkIssue = () => {
    setRowsLinkIssue([...rowsLinkIssue, { value: "please add details", selectValue: "Option1" }]);
  };

  const handleChange = (val, index) => {
    const updatedRows = [...rows];
    updatedRows[index].value = val;
    setRows(updatedRows);
  };

  const handleSelectChange = (event, index) => {
    const updatedRows = [...rows];
    updatedRows[index].selectValue = event.target.value;
    setRows(updatedRows);
  };

  const handleChangeLinkIssue = (val, index) => {
    const updatedRows = [...rowsLinkIssue];
    updatedRows[index].value = val;
    setRowsLinkIssue(updatedRows);
  };

  const handleSelectChangeLinkIssue = (event, index) => {
    const updatedRows = [...rowsLinkIssue];
    updatedRows[index].selectValue = event.target.value;
    setRowsLinkIssue(updatedRows);
  };

  const handleCancel = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleCancelLinkIssue = (index) => {
    const updatedRows = rowsLinkIssue.filter((_, i) => i !== index);
    setRowsLinkIssue(updatedRows);
  };



  const [isOpen, setIsOpen] = useState(false);


  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const [isSubtaskPopupOpen, setIsSubtaskPopupOpen] = useState(false);

  const handleSubtaskOpenPopup = () => {
    setIsSubtaskPopupOpen(true);
  };

  const handleSubtaskClosePopup = () => {
    setIsSubtaskPopupOpen(false);
  };
  // Toggle the popover
  const handleToggle = () => setIsOpen((prev) => !prev);

  // Change status and close popover
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setMessage(newStatus);
    setIsOpen(false);
  };

  const [comments, setComments] = useState([]);
  const quillRef = useRef(null);

  const handleAddComment = () => {
    const commentText = quillRef.current?.getEditor().getText().trim();
    if (commentText) {
      const newComment = {
        text: commentText,
        author: 'User',
        timestamp: new Date().toLocaleString(),
      };
      setComments([...comments, newComment]);
      quillRef.current?.getEditor().setText(''); // Clear editor after submitting
    }
  };

  const items = [
    { title: "Details", text: "Choose an option below" },

  ];

  const [selectedOption, setSelectedOption] = useState("Option1");

  const handleChangeAccordian = (e) => {
    setSelectedOption(e.target.value);
  };

  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  let { id } = useParams();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;

    // Merge and filter duplicates by file name
    const mergedFiles = [...uploadedFiles, ...selectedFiles];
    const uniqueFiles = Array.from(
      new Map(mergedFiles.map(file => [file.name, file])).values()
    );

    setUploadedFiles(uniqueFiles);
    setSelectedFiles([]);
  };

  const handleRemove = (index) => {
    const updated = [...uploadedFiles];
    updated.splice(index, 1);
    setUploadedFiles(updated);
  };

  // Inline styles
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '40px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '16px',
    },
    button: {
      backgroundColor: '#2563eb',
      color: '#fff',
      padding: '10px 16px',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    fileList: {
      marginTop: '20px',
    },
    listItem: {
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    removeBtn: {
      background: '#ef4444',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '4px 10px',
      cursor: 'pointer',
      fontSize: '12px',
      marginLeft: '10px',
    },
    fileInput: {
      marginBottom: '10px',
    },
  };
  const [editableFields, setEditableFields] = useState({});
  const [issueData, setIssueData] = useState("");
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/GetIssuedetailsbyissueid/${id}`)
      .then((response) => {
        setIssueData(response.data);
        setStatus(response.data.status || "Open");
        // Initialize editable fields once API call is successful
        const initialFields = {
          "Description": response.data.description || "NA",
          "In Scope": response.data.inScope || "NA",
          "Out Scope": response.data.outScope || "NA",
          "Business Need Benefits Details": response.data.businessNeedBenefitsDetails || "NA",
          "Learnings": "" // Default since API doesn't return it
        };
        setEditableFields(initialFields);
      })
      .catch((error) => {
        console.error("Error fetching issue details:", error);
      });
  }, [id]);
  const [accordionFields, setAccordionFields] = useState({
    assignee: "",
    reporter: "",
    priority: "",
    primaryBA: ""
  });
  const fetchTransitions = () => {
    axios
      .post("http://localhost:8080/api/workflow/transitions", {
        userRole: "BA",
        currentStatus: status,
        workflowId: "WF-1"
      })
      .then((response) => {
        setTransitionOptions(response.data.transition || []);
        setShowDropdown(true);
      })
      .catch((error) => {
        console.error("Error fetching transitions:", error);
      });
  };
  const getTagColor = (status) => {
    switch (status) {
      case "FSD Creation":
        return "blue";
      default:
        return "gray";
    }
  };

  const handleAccordionChange = (e, field) => {
    setAccordionFields(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };
  // Populate from API once it's loaded
  useEffect(() => {
    if (issueData) {
      setAccordionFields({
        assignee: issueData.assignee || "",
        reporter: issueData.reporter || "",
        priority: issueData.priority || "",
        primaryBA: issueData.primaryBA || ""
      });
    }
  }, [issueData]);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card flexDirection="column" w="100%" px="25px" mb="20px" overflow="hidden">
        <Popup isOpen={isPopupOpen} data={message} onClose={handleClosePopup} />
        <SubtaskPopup isOpen={isSubtaskPopupOpen} onClose={handleSubtaskClosePopup} />
        <div style={{ display: "flex", width: "100%" }}>

          {/* Left Section (70%) */}
          <div style={{ flex: 6 }}>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 500, marginTop: "10px" }}>
                {issueData ? issueData.summary : "Loading summary..."}
              </div>
              <div>
                <Menu>
                  <MenuButton as={Button} variant="outline" size="sm">
                    + Add
                  </MenuButton>
                  <Portal>
                    <MenuList>
                      <MenuItem>Attachment</MenuItem>
                      <MenuItem onClick={() => {
                        handleSubtaskOpenPopup();
                      }}>Subtask</MenuItem>
                      <MenuItem onClick={addRowLinkIssue}>Linked Issue</MenuItem>
                      <MenuItem>Web Link</MenuItem>
                    </MenuList>
                  </Portal>
                </Menu>
              </div>

              {/* Editable Sections */}
              <div style={{ margin: "5px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Description", "In Scope", "Out Scope", "Business Need Benefits Details"].map((label, index) => (
                  <div key={index} style={{ margin: "5px" }}>
                    <label style={{ fontSize: "18px", fontWeight: 500 }}>{label}</label>
                    <div>
                      <Editable
                        textAlign="start"
                        value={editableFields[label] || ""}
                        onChange={(val) =>
                          setEditableFields((prev) => ({
                            ...prev,
                            [label]: val,
                          }))
                        }
                      >
                        <EditablePreview />
                        <EditableInput />
                      </Editable>
                    </div>
                  </div>
                ))}

                <div style={{ margin: "5px" }}>
                  <label style={{ fontSize: "18px", fontWeight: 500 }}>Attachments</label>
                  <div>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      style={styles.fileInput}
                    />

                    <button onClick={handleUpload} style={styles.button}>
                      Upload
                    </button>

                    {uploadedFiles.length > 0 && (
                      <div style={styles.fileList}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                          Uploaded Files:
                        </h3>
                        <ul style={{ paddingLeft: '0' }}>
                          {uploadedFiles.map((file, index) => (
                            <li key={index} style={styles.listItem}>
                              <span>
                                {file.name} ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                              <button
                                style={styles.removeBtn}
                                onClick={() => handleRemove(index)}
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtask Section */}
                <div style={{ margin: "5px" }}>
                  <label style={{ fontSize: "18px", fontWeight: 500 }}>Subtask</label>
                  <div>
                    {rows.map((row, index) => (
                      <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>


                        <Select
                          value={row.selectValue}
                          onChange={(e) => handleSelectChange(e, index)}
                          width="200px"
                        >
                          <option value="Option1">Dev Task</option>
                          <option value="Option2">Functional Testcases</option>
                          <option value="Option3">QA Testcases</option>
                          <option value="Option4">Sub-Task</option>
                        </Select>


                        <Editable
                          defaultValue={row.value}
                          onChange={(val) => handleChange(val, index)}
                        >
                          <EditablePreview
                            border="1px solid"
                            borderColor="lightgreen"
                            p={2}
                            borderRadius="md"
                          />
                          <EditableInput
                            border="1px solid"
                            borderColor="lightgreen"
                            p={2}
                            borderRadius="md"
                          />
                        </Editable>

                        {/* Cancel Button */}
                        <Button colorScheme="red" size="sm" onClick={() => handleCancel(index)}>
                          Cancel
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Link Issue Section */}
                <div style={{ margin: "5px" }}>
                  <label style={{ fontSize: "18px", fontWeight: 500 }}>Link Issue</label>
                  <div>
                    {rowsLinkIssue.map((row, index) => (
                      <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>

                        {/* Select Dropdown */}
                        <Select
                          value={row.selectValue}
                          onChange={(e) => handleSelectChangeLinkIssue(e, index)}
                          width="200px"
                        >
                          <option value="Option1">Dev Task</option>
                          <option value="Option2">Functional Testcases</option>
                          <option value="Option3">QA Testcases</option>
                          <option value="Option4">Sub-Task</option>
                        </Select>

                        {/* Editable Input */}
                        <Editable
                          defaultValue={row.value}
                          onChange={(val) => handleChangeLinkIssue(val, index)}
                        >
                          <EditablePreview
                            border="1px solid"
                            borderColor="lightgreen"
                            p={2}
                            borderRadius="md"
                          />
                          <EditableInput
                            border="1px solid"
                            borderColor="lightgreen"
                            p={2}
                            borderRadius="md"
                          />
                        </Editable>

                        {/* Cancel Button */}
                        <Button colorScheme="red" size="sm" onClick={() => handleCancelLinkIssue(index)}>
                          Cancel
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ margin: "5px" }}>
                  <label style={{ fontSize: "18px", fontWeight: 500 }}>Activity</label>

                  <Tabs defaultIndex={0}>
                    <TabList>
                      <Tab>
                        <LuUser />
                        Comments
                      </Tab>
                      <Tab>
                        <LuFolder />
                        Link Issues
                      </Tab>
                      <Tab>
                        <LuSquareCheck />
                        Attachments
                      </Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel>
                        {/* Editor Section */}
                        <ReactQuill ref={quillRef} theme="snow" />
                        <Button colorScheme="blue" mt={3} onClick={handleAddComment}>Submit Comment</Button>

                        {/* Comments Section - Styled like Jira */}
                        <VStack mt={5} align="stretch" spacing={4}>
                          <Text fontSize="lg" fontWeight="bold">Comments:</Text>
                          {comments.length === 0 ? (
                            <Text>No comments yet</Text>
                          ) : (
                            comments.map((comment, index) => (
                              <Box key={index} p={4} borderWidth={1} borderRadius="lg" bg="gray.50">
                                <HStack mb={2}>
                                  <Avatar name={comment.author} size="sm" />
                                  <Box>
                                    <Text fontWeight="bold">{comment.author}</Text>
                                    <Text fontSize="sm" color="gray.500">{comment.timestamp}</Text>
                                  </Box>
                                </HStack>
                                <Text>{comment.text}</Text>
                                <Divider mt={3} />
                              </Box>
                            ))
                          )}
                        </VStack>
                      </TabPanel>
                      <TabPanel>
                        <p>Manage your projects</p>
                      </TabPanel>
                      <TabPanel>
                        <p>Manage your tasks for freelancers</p>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </div>

              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: "1px", backgroundColor: "#c9c9c9" }}></div>

          {/* Right Section (30%) */}
          <div style={{ flex: 4 }}>
            <div style={{ marginTop: "10px", marginLeft: "10px" }}>
              {/* Popover */}
              <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <PopoverTrigger>

                  <div>
                    <Menu isOpen={showDropdown} onClose={() => setShowDropdown(false)}>
                      <MenuButton
                        as={Button}
                        size="sm"
                        variant="outline"
                        rightIcon={<ChevronDownIcon />}
                        onClick={() => {
                          fetchTransitions(); // still calls your API
                          setShowDropdown(!showDropdown);
                        }}
                      >
                        {status || "Change Status"}
                      </MenuButton>

                      <MenuList minW="250px" p={1}>
                        {transitionOptions.map((option, index) => (
                          <MenuItem
                            key={index}
                            onClick={() => {
                              if (option.hasScreen) {
                                const fields = option.requiredFields
                                  ? option.requiredFields.split(",").map((f) => f.trim())
                                  : [];
                                setTransitionPopupData({ ...option, parsedFields: fields });
                                setIsTransitionPopupOpen(true);
                              } else {
                                handleStatusChange(option.toStatus);
                              }
                              setShowDropdown(false);
                            }}
                            px={3}
                            py={2}
                          >
                            <HStack justify="space-between" w="100%">
                              <Box>
                                <Text fontSize="sm">{option.action || "Transition to"}</Text>
                              </Box>
                              <HStack>
                                <Icon as={ArrowRightIcon} boxSize={4} />
                                <Tag
                                  size="sm"
                                  variant="solid"
                                  colorScheme={getTagColor(option.toStatus)}
                                >
                                  {option.toStatus}
                                </Tag>
                              </HStack>
                            </HStack>
                          </MenuItem>
                        ))}

                        {/* <MenuItem
                          onClick={() => {
                            console.log("View workflow clicked");
                          }}
                          mt={1}
                          fontSize="sm"
                          fontWeight="medium"
                          color="blue.500"
                        >
                          View workflow
                        </MenuItem> */}
                      </MenuList>
                    </Menu>
                  </div>

                </PopoverTrigger>
              </Popover>
            </div>

            <div style={{ marginTop: "10px", marginLeft: "10px" }}>
              <div>
                <Accordion allowMultiple>
                  {items.map((item, index) => (
                    <AccordionItem key={index}>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">{item.title}</Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel>
                        {index === 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label>Assignee</label>
                              <Select value={accordionFields.assignee} onChange={(e) => handleAccordionChange(e, "assignee")} width="200px">
                                <option value="Option1">Saurav Kumar</option>
                                <option value="Option2">Om Thange</option>
                                <option value="Option3">Prathamesh Kokane</option>
                              </Select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label>Reporter</label>
                              <Select value={accordionFields.reporter} onChange={(e) => handleAccordionChange(e, "reporter")} width="200px">
                                <option value="saurav.kumar10">Saurav Kumar</option>
                                <option value="HI448213">Om Thange</option>
                              </Select>
                            </div>



                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label>Priority</label>
                              <Select value={accordionFields.priority} onChange={(e) => handleAccordionChange(e, "priority")} width="200px">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                              </Select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label>CR Approved Date</label>

                            </div>

                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label>Primary BA</label>
                              <Select value={accordionFields.primaryBA} onChange={(e) => handleAccordionChange(e, "primaryBA")} width="200px">
                                <option value="Prachi Darade">Prachi Darade</option>
                                <option value="Mahesh nair">Mahesh nair</option>
                              </Select>
                            </div>
                          </div>

                        ) : (
                          <p>{item.text}</p>
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Modal
        isOpen={isTransitionPopupOpen}
        onClose={() => setIsTransitionPopupOpen(false)}
        size="xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderRadius="lg" boxShadow="lg">
          <ModalHeader fontWeight="bold" fontSize="xl">
            {transitionPopupData?.toStatus} - Required Fields
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={5} align="stretch">
              {transitionPopupData?.requiredFields
                ?.split(",")
                .map((field) => {
                  const trimmedField = field.trim();
                  const isDate = trimmedField.toLowerCase().includes("date");

                  return (
                    <FormControl key={trimmedField}>
                      <FormLabel fontWeight="medium">
                        {trimmedField} <span style={{ color: 'red' }}>*</span>
                      </FormLabel>
                      <Input
                        type={isDate ? "date" : "text"}
                        placeholder={`Enter ${trimmedField}`}
                        value={transitionFormData[trimmedField] || ""}
                        onChange={(e) =>
                          setTransitionFormData((prev) => ({
                            ...prev,
                            [trimmedField]: e.target.value,
                          }))
                        }
                      />
                    </FormControl>
                  );
                })}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                const requiredFields = transitionPopupData?.requiredFields
                  ?.split(",")
                  .map((f) => f.trim()) || [];

                const isFormValid = requiredFields.every(
                  (field) => transitionFormData[field]
                );

                if (!isFormValid) {
                  toast.error("Please fill all required fields.");
                  return;
                }

                console.log("Form Submitted:", transitionFormData);
                setIsTransitionPopupOpen(false);
                handleStatusChange(transitionPopupData?.toStatus);
              }}
            >
              Submit
            </Button>
            <Button variant="ghost" onClick={() => setIsTransitionPopupOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>



    </Box>

  );
}
