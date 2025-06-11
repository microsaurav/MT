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
  Image
} from "@chakra-ui/react";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Popup from '../WorkflowPopupp';
import SubtaskPopup from '../SubtaskPopup';
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu"
import axios from 'axios';
import Loading from '../components/Loading';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ArrowRightIcon } from "lucide-react"; // optional icon
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the default styles
export default function Overview() {

  const [rows, setRows] = useState([]);
  const [rowsLinkIssue, setRowsLinkIssue] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Open");
  const [previewFile, setPreviewFile] = useState(null); // { filename, blobUrl, type }
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [status, setStatus] = useState(""); // current status
  const [transitionOptions, setTransitionOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // control showing select
  const [tabIndex, setTabIndex] = useState(0);
  const [transitionFields, setTransitionFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [isTransitionPopupOpen, setIsTransitionPopupOpen] = useState(false);
  const [transitionPopupData, setTransitionPopupData] = useState(null);
  const [transitionFormData, setTransitionFormData] = useState({});
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  console.log("userData", userData);  
  const username = userData.username
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
  // Helper function to convert to camelCase
  function toCamelCase(str) {
    return str
      .replace(/\s(.)/g, (match, group1) => group1.toUpperCase())
      .replace(/^(.)/, (match, group1) => group1.toLowerCase());
  }
const fetchComments = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/comments/getCommentByIssueId/${id}`);
    const formatted = response.data.map((c) => ({
      author: c.commentBy,
      timestamp: new Date(c.timestamp).toLocaleString(),
      text: c.comment,
    }));
    setComments(formatted);
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

 const handleAddComment = async () => {
  const editor = quillRef.current?.getEditor();
  const commentText = editor?.getText()?.trim();
  const commentHTML = editor?.root?.innerHTML?.trim();

  if (!commentText) return;

  const payload = {
    issueId:id,
    comment: commentHTML,
    timestamp: getISTDateTime(),
    commentBy: username,
  };

  try {
    setLoading(true);
    await axios.post("http://localhost:8080/api/comments/postCommentByIssueId", payload);
    editor.setText(""); // clear editor
    fetchComments(); // refresh comment list
  } catch (error) {
    console.error("Error submitting comment:", error);
  } finally {
    setLoading(false);
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
 
function getISTDateTime() {
  const now = new Date();

  // Format to 'yyyy-MM-ddTHH:mm:ss' using local time (which is already IST)
  const pad = (n) => n.toString().padStart(2, '0');
  const formatted =
    now.getFullYear() +
    '-' +
    pad(now.getMonth() + 1) +
    '-' +
    pad(now.getDate()) +
    'T' +
    pad(now.getHours()) +
    ':' +
    pad(now.getMinutes()) +
    ':' +
    pad(now.getSeconds());

  return formatted;
}


  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    for (const file of selectedFiles) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const base64Data = e.target.result.split(",")[1]; // Remove the data prefix

        const payload = {
          issueId: id, // Replace with dynamic issueId if available
          filename: file.name,
          uploadedBy: username, // Replace with dynamic username if needed
          uploadedTimestamp: getISTDateTime(),
          filedata: base64Data,
        };
        setLoading(true)
        try {

          const response = await fetch("http://localhost:8080/api/uploadDocument", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            toast.error("Error Uploading File")
            throw new Error("Upload failed");
          }

          console.log(`Uploaded: ${file.name}`);
          toast.success(`File: ${file.name} uploaded successfully!`)
          fetchAttachments(); // Refresh attachments after upload
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
        } finally {
          setLoading(false)
        }
      };

      reader.readAsDataURL(file);
    }

    // Merge and deduplicate after upload
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
        userRole: userData.userRole,
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
  const getFileType = (filename) => {
    const parts = filename.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  };

  const getMimeType = (ext) => {
    switch (ext) {
      case "png":
        return "image/png";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "gif":
        return "image/gif";
      case "webp":
        return "image/webp";
      case "pdf":
        return "application/pdf";
      case "txt":
        return "text/plain";
      case "json":
        return "application/json";
      case "csv":
        return "text/csv";
      case "doc":
        return "application/msword";
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case "xls":
        return "application/vnd.ms-excel";
      case "xlsx":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      default:
        return "application/octet-stream";
    }
  };

  const handleAccordionChange = (e, field) => {
    setAccordionFields(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };
  const fetchAttachments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/getDocumentsByIssueId/${id}`);
      if (!response.ok) {

        throw new Error("Failed to fetch attachments");
      }

      const data = await response.json();
      setAttachments(data);
    } catch (error) {
      console.error("Error fetching attachments:", error);
    } finally {
      setLoading(false);
    }
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
  if (loading) return <Loading />;
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

                  <Tabs
                    index={tabIndex}
                    onChange={(index) => {
                      setTabIndex(index);

                      // If Attachments tab is selected (index 2)
                      if (index === 2) {
                        fetchAttachments();
                      }
                      if(index === 0){
                        fetchComments();
                      }
                    }}
                  >
                    {/* Preview Modal */}
                    <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} isCentered>
                      <ModalOverlay />
                      <ModalContent
                        maxW={{ base: "90vw", sm: "80vw", md: "70vw", lg: "60vw", xl: "50vw" }}
                      >
                        <ModalHeader>{previewFile?.filename}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          {previewFile?.type === "pdf" ? (
                            <iframe
                              src={previewFile.blobUrl}
                              width="100%"
                              height="500px"
                              title={previewFile.filename}
                              style={{ borderRadius: "8px", border: "1px solid #ddd" }}
                            />
                          ) : ["png", "jpg", "jpeg", "gif", "webp"].includes(previewFile?.type) ? (
                            <Image
                              src={previewFile.blobUrl}
                              alt={previewFile.filename}
                              maxW="100%"
                              maxH="500px"
                              borderRadius="md"
                            />
                          ) : (
                            <Text>Preview not available for this file type.</Text>
                          )}
                        </ModalBody>
                        <ModalFooter>
                          <Button onClick={() => setIsPreviewOpen(false)}>Close</Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>


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
                                <Box dangerouslySetInnerHTML={{ __html: comment.text }} />
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
                        {attachments.length === 0 ? (
                          <Text>No attachments</Text>
                        ) : (
                          <VStack align="stretch" spacing={5}>
                            {["TSD", "FSD", "Others"].map((category) => {
                              const filtered = attachments.filter((att) => {
                                const name = att.filename.toLowerCase();
                                if (category === "TSD") return name.includes("tsd");
                                if (category === "FSD") return name.includes("fsd");
                                return !name.includes("tsd") && !name.includes("fsd");
                              });

                              if (filtered.length === 0) return null;

                              return (
                                <Box key={category}>
                                  <HStack mb={2}>
                                    <Icon as={LuFolder} color="blue.500" />
                                    <Text fontWeight="bold" fontSize="lg">
                                      {category} Documents
                                    </Text>
                                  </HStack>
                                  <VStack spacing={3} align="stretch">
                                    {filtered.map((att) => {
                                      const fileType = getFileType(att.filename);
                                      const mimeType = getMimeType(fileType);
                                      const blobUrl = `data:${mimeType};base64,${att.filedata}`;
                                      const isImage = mimeType.startsWith("image");

                                      const isPDF = mimeType === "application/pdf";

                                      return (
                                        <HStack
                                          key={att.attachmentId}
                                          p={2}
                                          bg="gray.50"
                                          borderRadius="md"
                                          justify="space-between"
                                        >
                                          {isImage ? (
                                            <Image
                                              boxSize="50px"
                                              src={blobUrl}
                                              alt={att.filename}
                                              objectFit="cover"
                                              borderRadius="md"
                                            />
                                          ) : (
                                            <Icon as={LuFolder} boxSize={6} color="gray.400" />
                                          )}

                                          <VStack align="start" flex="1" spacing={0}>
                                            <Text fontWeight="medium">{att.filename}</Text>
                                            <Text fontSize="sm" color="gray.500">
                                              {att.uploadedBy} • {new Date(att.uploadedTimestamp).toLocaleString()}
                                            </Text>
                                          </VStack>

                                          <HStack spacing={2}>
                                            <a href={blobUrl} download={att.filename}>
                                              <Button size="sm">Download</Button>
                                            </a>
                                            <Button
                                              size="sm"
                                              onClick={() => {
                                                setPreviewFile({
                                                  filename: att.filename,
                                                  blobUrl,
                                                  type: fileType,
                                                  mimeType,
                                                });
                                                setIsPreviewOpen(true);
                                              }}
                                            >
                                              View
                                            </Button>
                                          </HStack>
                                        </HStack>
                                      );
                                    })}

                                  </VStack>
                                </Box>
                              );
                            })}
                          </VStack>
                        )}
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
            {previewFile?.mimeType === "application/pdf" ? (
              <iframe
                src={previewFile.blobUrl}
                width="100%"
                height="500px"
                title={previewFile.filename}
              />
            ) : previewFile?.mimeType?.startsWith("image") ? (
              <Image
                src={previewFile.blobUrl}
                alt={previewFile.filename}
                maxW="100%"
                borderRadius="md"
              />
            ) : (
              <Text>Preview not available for this file type.</Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={async () => {
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

                // Build payload for crDataPush API
                const payload = {
                  issueId: id, // Replace "IT-1" with your fallback logic
                  status: transitionPopupData?.toStatus,
                };

                requiredFields.forEach((field) => {
                  const camelKey = toCamelCase(field); // Convert to camelCase
                  payload[camelKey] = transitionFormData[field];
                });

                try {
                  const response = await fetch("http://localhost:8080/api/crDataPush", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                  });

                  if (!response.ok) {
                    throw new Error("Failed to submit the form.");
                  }

                  toast.success("Form submitted successfully!");
                  setTransitionFormData({});
                  setIsTransitionPopupOpen(false);
                  handleStatusChange(transitionPopupData?.toStatus);
                } catch (error) {
                  toast.error("Error submitting the form.");
                  console.error(error);
                }
              }}
            >
              Submit
            </Button>

            <Button variant="ghost" onClick={() => {
              setTransitionFormData({});
              setIsTransitionPopupOpen(false);
            }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>



    </Box>

  );
}
