import React, { useState, useRef, useEffect } from 'react';
import EffortEstimationTable from './components/EffortEstimationTable';
import {
  Box,
  SimpleGrid,
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
  Tooltip,
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
  HStack,
  Divider,
  Tag,
  Icon,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Link,
  IconButton,
  List,
  ListItem,
  GridItem
} from "@chakra-ui/react";
import {
  LuCalendarClock,
  LuFolder,
  LuSquareCheck,
  LuUser,
  LuListChecks,
  LuPaperclip,
  LuImage,
  LuFileText,
  LuFile,
  LuDownload,
  LuTrash,
  LuCheckCheck
} from "react-icons/lu";
import '../AdminView.css'
import { FaBug, FaUserCircle, FaArrowUp } from "react-icons/fa"; // ✅ Added missing icons
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom"; // ✅ Added `Link`, already had useNavigate/useParams
import { MdAttachMoney, MdAssignment } from "react-icons/md";
import { PiTestTubeFill } from "react-icons/pi"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Popup from '../WorkflowPopupp';
import SubtaskPopup from '../SubtaskPopup';
import axios from 'axios';
import Loading from '../components/Loading';
import { ChevronDownIcon, EditIcon, DeleteIcon, ViewIcon, DownloadIcon } from "@chakra-ui/icons";
import { ArrowRightIcon } from "lucide-react"; // optional icon

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the default styles
import BeatLoader from 'components/beatloader/BeatLoader';
import { GrResources } from 'react-icons/gr';

export default function Overview() {

  const [rows, setRows] = useState([]);
  const [rowsLinkIssue, setRowsLinkIssue] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Open");
  const [previewFile, setPreviewFile] = useState(null); // { filename, blobUrl, type }
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [dateDetails, setDateDetails] = useState({});
  const [status, setStatus] = useState(""); // current status
  const [transitionOptions, setTransitionOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // control showing select
  const [tabIndex, setTabIndex] = useState(0);
  const [transitionFields, setTransitionFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [isTransitionPopupOpen, setIsTransitionPopupOpen] = useState(false);
  const [transitionPopupData, setTransitionPopupData] = useState(null);
  const [transitionFormData, setTransitionFormData] = useState({});
  const [linkedIssues, setLinkedIssues] = useState([]);
  const [editorValue, setEditorValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [subTasks, setSubTasks] = useState([]);
  const [nestedChildCRs, setNestedChildCRs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userSuggestions, setUserSuggestions] = useState([]);

  const navigate = useNavigate();
  const [showEditor, setShowEditor] = useState(false);
  const [value, setValue] = useState("");
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

  const handleDeleteComment = async (issueId, commentId, index) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/comments/deleteCommentByIssueIdAndComment/${issueId}/${commentId}`);
      if (response.status === 200) {
        // Remove comment from state to update UI
        const updatedComments = comments.filter((_, i) => i !== index);
        setComments(updatedComments);
        toast.success("Comment deleted successfully");
      } else {
        toast.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Error deleting comment");
    }
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
  const handleEditClick = (index) => {
    if (!editValue.trim()) {
      toast({
        title: "Edit cannot be empty.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
    setEditIndex(index);
    setEditValue(comments[index].text);
    setIsEditing(true);
  };
  const formatToISOString = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"
  };
  const handleSaveEdit = async () => {
    if (editIndex === null) return;

    if (!editValue.trim()) {
      toast.error("Edit cannot be empty.");
      return;
    }

    const updatedComment = {
      issueId: id,
      comment: editValue,
      timestamp: new Date().toISOString().slice(0, 19),
      commentBy: comments[editIndex].author,
    };

    try {
      await axios.put("http://localhost:8080/api/comments/updateCommentById", updatedComment);

      // Update comments list locally
      const newComments = [...comments];
      newComments[editIndex].text = editValue;
      setComments(newComments);

      setIsEditing(false);
      setEditIndex(null);
      setEditValue("");
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
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
  const [replyEditors, setReplyEditors] = useState({});
  const [replyValues, setReplyValues] = useState({});
  const replyQuillRefs = React.useRef({});

  const toggleReplyEditor = (index) => {
    setReplyEditors((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
    if (!replyQuillRefs.current[index]) {
      replyQuillRefs.current[index] = React.createRef();
    }
  };

  const handleReplyChange = (value, index) => {
    setReplyValues((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleAddReply = async (index) => {
    const replyText = replyValues[index]?.trim();
    if (!replyText) return;

    const parentComment = comments[index];
    const payload = {
      issueId: id,
      comment: replyText,
      timestamp: new Date().toISOString(),
      commentBy: username,
      parentCommentId: parentComment.commentId,
    };

    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/comments/postCommentByIssueId", payload);
      setReplyValues((prev) => ({ ...prev, [index]: "" }));
      setReplyEditors((prev) => ({ ...prev, [index]: false }));
      fetchComments(); // Refresh comments including replies
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setLoading(false);
    }
  };
  const quillRef = useRef(null);
  // Helper function to convert to camelCase
  function toCamelCase(str) {
    return str
      .replace(/\s(.)/g, (match, group1) => group1.toUpperCase())
      .replace(/^(.)/, (match, group1) => group1.toLowerCase());
  }
  const fetchComments = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/getCommentByIssueId/${id}`);
      const formatted = response.data.map((c) => ({
        commentId: c.commentId,
        issueId: c.issueId,
        author: c.commentBy,
        timestamp: new Date(c.timestamp).toLocaleString(),
        text: c.comment,
        parentId: c.parentCommentId
      }));
      setComments(formatted);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
    finally {
      setLoading(false)
    }
  };
  // const fetchSubTasksAndLinkedIssues = async () => {
  //   setLoading(true)
  //   try {
  //     const res = await fetch(`http://localhost:8080/api/GetIssuedetailsbyParentCr/${id}`);
  //     const data = await res.json();
  //     console.log("SubTask and Issues", data);
  //     const subtasks = data.filter(item => item.issueType !== "Bug");
  //     const linked = data.filter(item => item.issueType === "Bug");

  //     setSubTasks(subtasks);
  //     setLinkedIssues(linked);
  //   } catch (error) {
  //     console.error("Error fetching subtasks/linked issues:", error);
  //   }
  //   finally {
  //     setLoading(false)
  //   }
  // };
  const fetchSubTasks = async () => {

    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8080/api/subtasks/SubtaskbyParentCR/${id}`);
      const data = await res.json();

      const subtasks = data.filter(item => item.workType !== "Defect");
      const linked = data.filter(item => item.workType === "Defect");

      setSubTasks(subtasks);
      setLinkedIssues(linked);
    } catch (error) {
      console.error("Error fetching subtasks/linked issues:", error);
    }
    finally {
      setLoading(false)
    }
  };
  const fetchLinkedIssues = async () => {
    setLoading(true)
    try {
      console.log("fetchLinkedIssues called");
      const res = await fetch(`http://localhost:8080/api/bugs/BugbyParentCR/${id}`);
      const data = await res.json();
      console.log("fetchLinkedIssues API response:", data);

      const subtasks = data.filter(item => item.workType !== "Defect");
      const linked = data.filter(item => item.workType === "Defect");

      setSubTasks(subtasks);
      setLinkedIssues(linked);
    } catch (error) {
      console.error("Error fetching subtasks/linked issues:", error);
    }
    finally {
      setLoading(false)
    }
  };

  const fetchDateDetails = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:8080/api/GetCrDateDetailsByIssueId/${id}`); // Replace with your actual endpoint
      if (response.status === 200) {
        setDateDetails(response.data);
      } else {
        console.error("Failed to fetch date details");
      }
    } catch (error) {
      console.error("Error fetching date details:", error);
    } finally {
      setLoading(false)
    }
  };

  // Quill properties
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["link", "image"],
        ["clean"],
      ]
    },
  };

  const formats = [
    "header", "bold", "italic", "underline", "strike",
    "blockquote", "list", "bullet", "indent", "link", "image"
  ];

  const handleAddComment = async (event) => {
    event.preventDefault();
    const editor = quillRef.current?.getEditor();
    const commentText = editor?.getText()?.trim();
    const commentHTML = editor?.root?.innerHTML?.trim();

    if (!commentText) return;

    const payload = {
      issueId: id,
      comment: commentHTML,
      timestamp: getISTDateTime(),
      commentBy: username,
    };

    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/comments/postCommentByIssueId", payload);
      setValue(""); // Clear the editor
      setShowEditor(false); // Hide the editor
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
  const [accordionFields, setAccordionFields] = useState({});
  const fileInputRef = React.useRef(null);

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
  };

  const formatDates = (dateString) => {
    const now = new Date(dateString);
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    };
    return now.toLocaleString('en-IN', options);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const handleDelete = async (issueId, filename) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/deleteDocument/${issueId}/${filename}`);
      if (response.status === 200) {
        setAttachments((prev) => prev.filter((file) => file.filename !== filename));
        setUploadedFiles((prev) => prev.filter((file) => file.filename !== filename));
        toast.success("Attachment deleted successfully");
      } else {
        toast.error("Failed to delete attachment");
      }
    } catch (error) {
      console.error("Error deleting attachment:", error);
      toast.error("Error deleting attachment");
    }
  };

  const handleRemove = (index) => {
    const updated = [...uploadedFiles];
    updated.splice(index, 1);
    setUploadedFiles(updated);
  };

  const handleAccordionChange = (e, field) => {
    const value = e.target.value;
    setAccordionFields((prev) => ({ ...prev, [field]: value }));

    axios.post("http://localhost:8080/api/crDataPush", {
      issueId: id,
      user: username,
      [field]: value,
    });
  };

  const handleAccordionEditableChange = (field, value) => {
    setAccordionFields((prev) => ({ ...prev, [field]: value }));

    axios.post("http://localhost:8080/api/crDataPush", {
      issueId: id,
      [field]: value,
    });
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
      .get(`http://localhost:8080/api/fetch/${id}`)
      .then((response) => {
        setIssueData(response.data);
        setStatus(response.data.status || "Open");

        let initialFields;
        if (response.data.issueType === "Defect") {
          initialFields = {
            "Description": response.data.description || "NA",
            "Steps to Reproduce": response.data.stepsToReproduce || "NA",
            "Expected Output": response.data.expectedOutput || "NA",
            "Actual Output": response.data.actualOutput || "NA",
          };
        } else {
          initialFields = {
            "Description": response.data.description || "NA",
            // "In Scope": response.data.inScope || "NA",
            // "Out Scope": response.data.outScope || "NA",
            "Qualitative Benefits": response.data.qualitativeBenefits || "NA",
            "Quantitaitve Benefits": response.data.quantitativeBenefits || "NA",
          };
        }
        setAccordionFields({
          assignee: response.data.assignee || "",
          reporter: response.data.reporter || "",
          priority: response.data.priority || "",
          crApprovedDate: response.data.crApprovedDate || "",
          primaryBA: response.data.primaryBA || "",
        });
        setEditableFields(initialFields);
      })
      .catch((error) => {
        console.error("Error fetching issue details:", error);
      });

    fetchComments();
  }, [id]);


  const fetchTransitions = () => {
    axios
      .post("http://localhost:8080/api/workflow/transitions", {
        userRole: userData.userRole,
        currentStatus: status,
        workflowId: issueData.workflowId
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
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString();
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return "—";
    const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
    return `${diff} days`;
  };

  const calculateDelay = (plannedEnd, actualEnd) => {
    if (!plannedEnd || !actualEnd) return "—";
    const delay = (new Date(actualEnd) - new Date(plannedEnd)) / (1000 * 60 * 60 * 24);
    return delay > 0 ? `${delay} days` : "On time";
  };

  // const handleAccordionChange = (e, field) => {
  //   setAccordionFields(prev => ({
  //     ...prev,
  //     [field]: e.target.value
  //   }));
  // };
  const fetchAttachments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/getDocumentsByIssueId/${id}`);
      const data = response.data;

      const formatted = data.map((c) => ({
        id: c.attachmentId,
        author: c.uploadedBy,
        filename: c.filename,
        issueId: c.issueId,
        size: c.fileSize,
        dateAdded: c.uploadedTimestamp,
        fileData: c.filedata
      }));
      console.log(formatted);
      setAttachments(formatted);
    } catch (error) {
      console.error("Error fetching attachments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (label, value) => {
    // Update field value in state
    setEditableFields((prev) => ({
      ...prev,
      [label]: value,
    }));

    // Prepare request payload
    const payload = {
      issueId: id,
      issueType: issueData.issueType,
      [label.toLowerCase().replace(/\s+/g, "")]: value  // Convert label to camelCase-ish keys like "description"
    };

    // Rename keys if needed to match exact backend expectation
    if (label === "Steps to Reproduce") payload.stepsToReproduce = value;
    else if (label === "Expected Output") payload.expectedOutput = value;
    else if (label === "Actual Output") payload.actualOutput = value;
    else if (label === "Description") payload.description = value;
    // else if (label === "In Scope") payload.inScope = value;
    // else if (label === "Out Scope") payload.outScope = value;
    else if (label === "Qualitative Benefits") payload.qualitativeBenefits = value;
    else if (label === "Quantitative Benefits") payload.quantitativeBenefits = value;

    // Remove unwanted derived key (from label.toLowerCase())
    // delete payload[label.toLowerCase().replace(/\s+/g, "")];

    // Send to API
    axios.post("http://localhost:8080/api/crDataPush", payload)
      .then(() => {
        console.log(`${label} updated successfully`);
      })
      .catch((err) => {
        console.error(`Error updating ${label}:`, err);
      });
  };

  const labelStyle = { fontSize: "18px", fontWeight: 500 };

  // Populate from API once it's loaded
  useEffect(() => {
    if (issueData) {
      setAccordionFields({
        assignee: issueData.assignee || "",
        reporter: issueData.reporter || "",
        priority: issueData.priority || "",
        primaryBA: issueData.primaryBA || ""
      });
      // Fetch attachments immediately when issueData changes (issue selected)
      fetchAttachments();
    }
  }, [issueData]);
  if (loading) return <Loading />;


  const handleTabChange = (index, event) => {
    if (event) {
      event.preventDefault();
    }
    console.log("Tab changed to", index);
    setTabIndex(index);
    switch (index) {
      case 0:
        fetchComments();
        break;
      case 1:
        fetchLinkedIssues();
        break;
      case 2:
        fetchAttachments();
        break;
      case 3:
        fetchDateDetails();
        break;
      case 4:
        fetchSubTasks();
        break;
      case 5:
        // Add logic for Resource Allocation if needed
        break;
      default:
        break;
    }
  };


  return (
    <Card mt={{ base: "130px", md: "55px", xl: "55px" }}
      borderRadius="md" maxH="430px" position="relative" overflowY="scroll" px={4} className="container">
      <Box flexDirection="column" display="flex" gap={4}>
        <Popup isOpen={isPopupOpen} data={message} onClose={handleClosePopup} />
        <SubtaskPopup isOpen={isSubtaskPopupOpen} onClose={handleSubtaskClosePopup} data={issueData} />
        <div style={{ display: "flex", width: "100%", height: "600px" }}>

          {/* Left Section (70%) */}
          <div style={{ flex: 7.5, height: "100%" }}>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 500, marginTop: "10px" }}>
                {issueData ? issueData.summary : <BeatLoader />}
              </div>
              <div>
                <Menu>
                  <MenuButton as={Button} variant="outline" size="sm">
                    + Add
                  </MenuButton>
                  <Portal>
                    <MenuList fontSize={"14px"}>
                      {/* <MenuItem>Attachment</MenuItem> */}
                      <MenuItem
                        onClick={() => {
                          const fileInput = document.createElement('input');
                          fileInput.type = 'file';
                          fileInput.multiple = true;
                          fileInput.style.display = 'none';
                          document.body.appendChild(fileInput);
                          fileInput.click();

                          fileInput.addEventListener('change', async (event) => {
                            if (event.target.files.length > 0) {
                              try {
                                handleFileChange(event);
                                await handleUpload();
                              } catch (error) {
                                console.error('Error uploading files:', error);
                              }
                            }
                            document.body.removeChild(fileInput);
                          });
                        }}
                      >
                        Attachment
                      </MenuItem>
                      <MenuItem onClick={() => {
                        handleSubtaskOpenPopup();
                      }}>Subtask</MenuItem>
                      {/* <MenuItem onClick={addRowLinkIssue}>Linked Issue</MenuItem> */}
                      {/* <MenuItem>Web Link</MenuItem> */}
                    </MenuList>
                  </Portal>
                </Menu>
              </div>

              {/* Editable Sections */}
              <div style={{ margin: "5px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {issueData.issueType === "Defect" ? (
                  ["Description", "Steps to Reproduce", "Expected Output", "Actual Output"].map((label, index) => (
                    <div key={index} style={{ margin: "5px" }}>
                      <label style={{ fontSize: "16px", fontWeight: 500 }}>{label}</label>
                      <div>
                        <Editable
                          fontSize="14px"
                          textAlign="start"
                          value={editableFields[label] || ""}
                          onSubmit={(val) => handleFieldChange(label, val)} // Use onSubmit instead of onChange
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
                  ))

                ) : (

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
                    {/* Description spans full width on md+ screens */}
                    <GridItem colSpan={{ base: 1, md: 2 }}>
                      <Box>
                        <FormLabel sx={labelStyle} m={0}>Description</FormLabel>
                        <Editable
                          textAlign="start"
                          value={editableFields["Description"] || ""}
                          onSubmit={(val) => handleFieldChange("Description", val)}
                          onChange={(val) =>
                            setEditableFields((prev) => ({
                              ...prev,
                              ["Description"]: val,
                            }))
                          }
                        >
                          <EditablePreview sx={{ padding: 0 }} />
                          <EditableInput />
                        </Editable>
                      </Box>
                    </GridItem>
                    {["Quantitative Benefits", "Qualitative Benefits"].map((label) => (
                      <GridItem key={label}>
                        <Box>
                          <FormLabel sx={labelStyle} m={0}>{label}</FormLabel>
                          <Editable p={0}
                            textAlign="start"
                            value={editableFields[label] || ""}
                            onSubmit={(val) => handleFieldChange(label, val)}
                            onChange={(val) =>
                              setEditableFields((prev) => ({
                                ...prev,
                                [label]: val,
                              }))
                            }
                          >
                            <EditablePreview sx={{ padding: 0 }} />
                            <EditableInput />
                          </Editable>
                        </Box>
                      </GridItem>
                    ))}
                  </SimpleGrid>
                )}
                <Box>
                  <Text fontSize="xl" fontWeight="bold">
                    CR Details
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {["Status", "Priority", "Severity", "Work Type"].map((label) => (
                      <Box key={label}>
                        <FormLabel sx={labelStyle}>{label}</FormLabel>
                        <Editable
                          textAlign="start"
                          value={editableFields[label] || ""}
                          onSubmit={(val) => handleFieldChange(label, val)}
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
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>

                {/* Attachment Modal */}
                {/* <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} isCentered>
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
                </Modal> */}
                <div style={{ margin: "5px" }}>
                  <label style={{ fontSize: "16px", fontWeight: 500 }}>Activity</label>

                  {/* <Tabs
                    index={tabIndex}
                    onChange={(index) => {
                      console.log("Tab changed to index:", index);
                      setTabIndex(index);
                      console.log("tabIndex state updated to:", index);

                      // If Attachments tab is selected (index 2)
                      if (index === 2) {
                        fetchAttachments();
                      }
                      if (index === 0) {
                        fetchComments();
                      }

                      if (index === 3) fetchDateDetails();
                      if (index === 1) fetchLinkedIssues();
                      if (index === 4) fetchSubTasks();
                    }}
                  > */}
                  <Box m={0}>
                    <Tabs index={tabIndex} onChange={(index, event) => handleTabChange(index, event)} variant="unstyled" defaultIndex={0} maxW="800px">
                      <TabList border="1px solid #dfe1e6" borderRadius="6px" bg="white" w="fit-content" mb={0} pb={0}>
                        {[
                          { label: "Comments", icon: LuUser },
                          { label: "Link Issues", icon: LuFolder },
                          {
                            label: (
                              <>
                                Attachments{" "}
                                {attachments.length > 0 && (
                                  <Box
                                    borderRadius="full"
                                    bg="#E5E7EB"
                                    color="#4A5568"
                                    fontSize="xs"
                                    fontWeight="medium"
                                    px={2}
                                    py={0.5}
                                    ml={1}
                                  >
                                    {attachments.length}
                                  </Box>
                                )}
                              </>
                            ),
                            icon: LuPaperclip,
                          },
                          { label: "Dates", icon: LuCalendarClock },
                          { label: "SubTasks", icon: LuListChecks },
                          { label: "Resource Allocation", icon: GrResources },
                        ].map((tab, idx) => (
                          <Tab
                            key={tab.label}
                            fontSize="sm"
                            fontWeight="normal"
                            px={4}
                            py={1}
                            borderRadius="0"
                            borderBottom="2px solid transparent"
                            color="#172B4D"
                            _selected={{
                              color: "#0052CC",
                              borderBottom: "2px solid #0052CC",
                              bg: "white",
                              fontWeight: "bold",
                            }}
                            _focus={{ boxShadow: "none" }}
                            _hover={{ bg: "#F4F5F7" }}
                            display="flex"
                            alignItems="center"
                            gap={1}
                          ><Icon as={tab.icon} boxSize={4} />
                            {tab.label}
                          </Tab>
                        ))}
                        {/* <Tab ></Tab> */}
                      </TabList>
                      <TabPanels maxW="620px">
                        <TabPanel p='12px 0 12px' >
                          <HStack align="flex-start" spacing={3} mb={2}>
                            <Avatar name={username} size="sm" />
                            <Box flex="1">
                              {!showEditor ? (
                                <Input placeholder='Add a comment'
                                  onFocus={() => {
                                    setShowEditor(true);
                                    setTimeout(() => {
                                      quillRef.current?.getEditor().focus();
                                    }, 0);
                                  }}
                                  bg="white"
                                />
                              ) : (
                                <VStack align="stretch" spacing={3}>
                                  <ReactQuill ref={quillRef} className="custom-quill"
                                    theme="snow"
                                    value={value}
                                    onChange={setValue}
                                    placeholder='Type your comment or @ to mention or notify someone.'
                                    modules={modules}
                                    formats={formats}
                                    style={{ minHeight: 80, fontSize: "0.7rem" }}
                                  />
                                  <HStack>
                                    <Button colorScheme='blue' size="sm" onClick={handleAddComment}>
                                      Save
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setShowEditor(false)} >
                                      Cancel
                                    </Button>
                                  </HStack>
                                </VStack>
                              )}
                            </Box>
                          </HStack>
                          {/* Comment List */}
                          <VStack mt={2} align="stretch" spacing={4}
                            overflowY="auto"
                            p={3}
                            bg="white"
                            maxH="280px"
                            className='container'
                          >
                            {comments.map((comment, index) => (
                              <Box key={index} mb={4} borderBottom="1px solid #E2E8F0" pb={3}>
                                <HStack align="flex-start" spacing={3}>
                                  <Avatar name={comment.author} size="sm" />
                                  <Box flex="1">
                                    <Text fontWeight="bold">{comment.author}</Text>
                                    <Text fontSize="xs" color="gray.500" mb={1}>
                                      {comment.timestamp}
                                    </Text>
                                    {/* Edit Mode */}
                                    {isEditing && editIndex === index ? (
                                      <Box>
                                        <ReactQuill
                                          ref={quillRef}
                                          className="custom-quill"
                                          onChange={setEditValue}
                                          modules={modules}
                                          formats={formats}
                                          theme='snow'
                                          style={{ minHeight: 80, fontSize: "0.7rem" }}
                                        />
                                        <HStack mt={2}>
                                          <Button colorScheme='blue' size="xs" onClick={handleSaveEdit}>Save</Button>
                                          <Button size="xs" variant="ghost" onClick={() => { setIsEditing(false); setEditIndex(null); }}>Cancel</Button>
                                        </HStack>
                                      </Box>
                                    ) : (
                                      <Box className='q1-editor'
                                        dangerouslySetInnerHTML={{ __html: comment.text }} p={0} mb={2} />
                                    )}
                                    <HStack spacing={3} fontSize="sm" color="gray.500" pb={2}>
                                      {!(isEditing && editIndex === index) && (
                                        <Button size="xs" variant="link" onClick={() => toggleReplyEditor(index)}>Reply</Button>
                                      )}
                                      {comment.author === username && !isEditing && (
                                        <Button size="xs" variant="link" onClick={() => handleEditClick(index)}>Edit</Button>
                                      )}
                                    </HStack>
                                    {/* Replies Section */}
                                    {replyEditors[index] && (
                                      <Box mt={2} ml={10}>
                                        <ReactQuill
                                          ref={replyQuillRefs.current[index]}
                                          className="custom-quill"
                                          value={replyValues[index] || ""}
                                          onChange={(val) => handleReplyChange(val, index)}
                                          modules={modules}
                                          formats={formats}
                                          theme='snow'
                                          style={{ minHeight: 60, fontSize: "0.7rem" }}
                                        />
                                        <HStack mt={2}>
                                          <Button colorScheme='blue' size="xs" onClick={() => handleAddReply(index)}>Submit</Button>
                                          <Button size="xs" variant="ghost" onClick={() => toggleReplyEditor(index)}>Cancel</Button>
                                        </HStack>
                                      </Box>
                                    )}
                                    {/* Display Replies */}
                                    {comment.replies && comment.replies.length > 0 && (
                                      <VStack spacing={3} mt={2} pl={6} align="stretch">
                                        {comment.replies.map((reply, rIndex) => (
                                          <Box key={rIndex} p={2} bg="gray.50" borderRadius="md">
                                            <HStack spacing={2} align="center">
                                              <Avatar name={reply.author} size="xs" />
                                              <Text fontWeight="bold" fontSize="sm">{reply.author}</Text>
                                              <Text fontSize="xs" color="gray.500">{reply.timestamp}</Text>
                                            </HStack>
                                            <Box mt={1} dangerouslySetInnerHTML={{ __html: reply.text }} />
                                          </Box>
                                        ))}
                                      </VStack>
                                    )}
                                  </Box>
                                </HStack>
                              </Box>
                            ))}
                          </VStack>
                        </TabPanel>
                        <TabPanel p={0}>
                          <Box maxH="400px" overflowY="auto" border="1px solid #E2E8F0" borderRadius="md" p={3}>
                            <Text fontWeight="bold" fontSize="md" mb={2}>Linked Work Items</Text>
                            <Text fontSize="sm" mb={3} color="gray.500">is blocked by</Text>

                            <VStack spacing={3} align="stretch">
                              {linkedIssues.map((issue) => (
                                <Flex
                                  key={issue.id}
                                  p={3}
                                  borderRadius="md"
                                  bg="white"
                                  boxShadow="sm"
                                  align="center"
                                  justify="space-between"
                                  _hover={{ boxShadow: "md", cursor: "pointer" }}
                                >
                                  {/* Left Section: Issue Info */}
                                  <Flex align="center" gap={3}>
                                    <Icon as={FaBug} color="red.500" boxSize={5} />
                                    <Box>
                                      <Text
                                        onClick={() => window.location.href = `/admin/view/${issue.issueId}`}
                                        color="blue.600"
                                        fontWeight="bold"
                                        _hover={{ textDecoration: "underline" }}
                                      >
                                        {issue.issueId}
                                      </Text>
                                      <Text fontSize="sm" color="gray.600">
                                        {issue.summary.length > 80
                                          ? issue.summary.slice(0, 77) + "..."
                                          : issue.summary}
                                      </Text>
                                    </Box>
                                  </Flex>

                                  {/* Right Section: Assignee + Status */}
                                  <Flex align="center" gap={2}>
                                    <Tooltip label={issue.assignee} fontSize="sm" hasArrow>
                                      <Avatar size="sm" icon={<FaUserCircle />} />
                                    </Tooltip>
                                    <Tag
                                      size="sm"
                                      colorScheme={
                                        issue.status === "Closed" ? "green" :
                                          issue.status === "In Progress" ? "yellow" :
                                            issue.status === "Open" ? "blue" :
                                              "gray"
                                      }
                                    >
                                      {issue.status}
                                    </Tag>
                                  </Flex>
                                </Flex>
                              ))}
                            </VStack>
                          </Box>
                        </TabPanel>
                        {/* <TabPanel>
                            {
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
                            }
                          </TabPanel> */}
                        <TabPanel p="7px 0">
                          <Table variant="simple" mt={0}>
                            <Thead>
                              <Tr
                                sx={{
                                  '& > th': {
                                    borderBottom: '2px solid',
                                    borderColor: 'gray.200',
                                  },
                                  '& > th:not(:last-child)': {
                                    textAlign: "start",
                                    padding: "4px 8px",
                                    _hover: {
                                      bg: 'gray.400',
                                      cursor: 'pointer',
                                    },
                                  },
                                }}
                              >
                                <Th w="40%">Name</Th>
                                <Th w="15%">Size</Th>
                                <Th w="30%">Date Added</Th>
                                <Th textAlign="end" w="15%">

                                </Th>
                              </Tr>
                            </Thead>
                            <Tbody
                              sx={{
                                '& > tr': {
                                  fontSize: '0.9rem',
                                  _hover: {
                                    bg: 'gray.200',
                                    cursor: 'pointer',
                                  }
                                }
                              }}
                            >
                              {attachments.map((attachment) => {
                                const fileType = getFileType(attachment.filename);
                                const mimeType = getMimeType(fileType);
                                const blobUrl = `data:${mimeType};base64,${attachment.fileData}`;
                                return (
                                  <Tr key={attachment.id}
                                    sx={{
                                      '& > td': {
                                        padding: '4px 8px 4px 8px',
                                        textAlign: 'start'
                                      },
                                    }}
                                  >
                                    <Td>
                                      <HStack>
                                        {(() => {
                                          const ext = getFileType(attachment.filename);
                                          const mimeType = getMimeType(ext);
                                          if (mimeType.startsWith("image/")) {
                                            return <Icon as={LuImage} boxSize={5} color="blue.600" />;
                                          } else if (mimeType === "text/plain") {
                                            return <Icon as={LuFileText} boxSize={5} color="blue.600" />;
                                          } else {
                                            return <Icon as={LuFile} boxSize={5} color="blue.600" />;
                                          }
                                        })()}
                                        <Tooltip label={`Uploaded by: ${attachment.author}`} placement="bottom" hasArrow>
                                          <Text ml={2} cursor="pointer">
                                            {attachment.filename}
                                          </Text>
                                        </Tooltip>
                                      </HStack>
                                    </Td>
                                    <Td>{formatSize(attachment.size)}</Td>
                                    <Td>{formatDates(attachment.dateAdded)}</Td>
                                    <Td textAlign="cwn">
                                      <IconButton
                                        aria-label="Delete Attachment"
                                        icon={<LuTrash />}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(attachment.issueId, attachment.filename)}
                                        mr={2}
                                      />
                                      <IconButton
                                        aria-label="Download Attachment"
                                        icon={<LuDownload />}
                                        size="sm"
                                        variant="ghost"
                                        as="a"
                                        href={blobUrl}
                                        download={attachment.filename}
                                      />
                                    </Td>
                                  </Tr>
                                )
                              }
                              )}
                            </Tbody>
                          </Table>
                        </TabPanel>

                        <TabPanel p={0}>
                          {/* Dates tab panel content */}
                          <Table variant="simple" size="sm">
                            <Thead bg="gray.100">
                              <Tr>
                                <Th>Phase</Th>
                                <Th>Planned Start</Th>
                                <Th>Planned End</Th>
                                <Th>Actual Start</Th>
                                <Th>Actual End</Th>
                                <Th>Duration</Th>
                                <Th>Delay</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {[
                                {
                                  title: "FSD",
                                  plannedStart: dateDetails?.plannedFSDStartDate,
                                  plannedEnd: dateDetails?.plannedFSDEndDate,
                                  actualStart: null,
                                  actualEnd: null,
                                },
                                {
                                  title: "QA Testing",
                                  plannedStart: dateDetails?.plannedQaTestingStartDate,
                                  plannedEnd: dateDetails?.plannedQaTestingEndDate,
                                  actualStart: dateDetails?.actualQaTestingStartDate,
                                  actualEnd: dateDetails?.actualQaTestingEndDate,
                                },
                                {
                                  title: "UAT",
                                  plannedStart: dateDetails?.plannedUatStartDate,
                                  plannedEnd: dateDetails?.plannedUatEndDate,
                                  actualStart: null,
                                  actualEnd: null,
                                },
                                {
                                  title: "Go Live",
                                  plannedStart: dateDetails?.plannedGoLiveDate,
                                  plannedEnd: null,
                                  actualStart: null,
                                  actualEnd: dateDetails?.actualGoLiveDate,
                                },
                              ].map((row) => {
                                const formatDate = (d) => d ? new Date(d).toLocaleDateString() : "-";
                                const duration = (s, e) => (s && e) ? `${(new Date(e) - new Date(s)) / (1000 * 3600 * 24)} day(s)` : "-";
                                const delay = (planned, actual) => (planned && actual)
                                  ? `${(new Date(actual) - new Date(planned)) / (1000 * 3600 * 24)} day(s)`
                                  : "-";

                                return (
                                  <Tr key={row.title}>
                                    <Td>{row.title}</Td>
                                    <Td>{formatDate(row.plannedStart)}</Td>
                                    <Td>{formatDate(row.plannedEnd)}</Td>
                                    <Td>{formatDate(row.actualStart)}</Td>
                                    <Td>{formatDate(row.actualEnd)}</Td>
                                    <Td>{duration(row.plannedStart, row.plannedEnd)}</Td>
                                    <Td>{delay(row.plannedEnd, row.actualEnd)}</Td>
                                  </Tr>
                                );
                              })}
                            </Tbody>
                          </Table>
                        </TabPanel>
                        <TabPanel>
                          <Box maxH="500px" overflowY="auto" p={2}>
                            <Text fontWeight="bold" fontSize="md" mb={3}>Subtasks</Text>

                            <VStack spacing={4} align="stretch">
                              {subTasks.map((task) => {
                                let typeIcon;
                                switch ((task.issueType || "").toLowerCase()) {
                                  case 'maintenance':
                                    typeIcon = <MdAttachMoney color="green" size={20} />;
                                    break;
                                  case 'qa':
                                    typeIcon = <PiTestTubeFill color="purple" size={20} />;
                                    break;
                                  default:
                                    typeIcon = <MdAssignment color="blue" size={20} />;
                                }

                                const priorityIcon = <FaArrowUp color="red" />;
                                const statusColor =
                                  (task.status || "").toLowerCase().includes("close") ? "green.100"
                                    : (task.status || "").toLowerCase().includes("development") ? "blue.100"
                                      : "gray.100";

                                return (
                                  <Flex
                                    key={task.id}
                                    p={4}
                                    bg="white"
                                    borderRadius="md"
                                    boxShadow="sm"
                                    justify="space-between"
                                    align="center"
                                    _hover={{ boxShadow: "md", cursor: "pointer" }}
                                    onClick={() => window.location.href = `/admin/view/${task.issueId}`}
                                  >
                                    {/* Left section with icon, ID, Summary */}
                                    <HStack spacing={4}>
                                      <Box>{typeIcon}</Box>
                                      <Box>
                                        <Text fontWeight="bold" color="blue.600">
                                          {task.issueId}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600" noOfLines={1}>
                                          {task.summary}
                                        </Text>
                                      </Box>
                                    </HStack>

                                    {/* Right section with Priority, Assignee (Avatar only), Status */}
                                    <HStack spacing={4}>
                                      <Box>{priorityIcon}</Box>
                                      <Tooltip label={task.assignee} fontSize="sm" hasArrow>
                                        <Avatar size="sm" icon={<FaUserCircle />} name={task.assignee} />
                                      </Tooltip>
                                      <Tag bg={statusColor} color="gray.800" fontWeight="bold" px={3} py={1}>
                                        {task.status}
                                      </Tag>
                                    </HStack>
                                  </Flex>
                                );
                              })}
                            </VStack>
                          </Box>
                        </TabPanel>
                        <TabPanel>
                          <EffortEstimationTable
                            issueData={issueData}
                            subTasks={subTasks}
                            linkedIssues={linkedIssues}
                            nestedChildCRs={nestedChildCRs}
                            dateDetails={dateDetails}
                            allUsers={allUsers}
                          />
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </Box>
                </div>

              </div>
            </div>
          </div>

          {/* Divider */}
          {/* <div style={{ width: "1px", backgroundColor: "#c9c9c9", height:  }}></div> */}

          {/* Right Section (30%) */}
          <div
            style={{ flex: 2.5, height: "50%" }}
          >
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
          </div>
        </div>
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
                {transitionPopupData?.requiredFields?.split(",").map((field) => {
                  const trimmedField = field.trim();
                  const isDate = trimmedField.toLowerCase().includes("date");

                  // Assignee autocomplete input
                  if (trimmedField.toLowerCase() === "assignee") {
                    return (
                      <FormControl key={trimmedField} position="relative" isRequired>
                        <FormLabel>
                          {trimmedField} <span style={{ color: "red" }}>*</span>
                        </FormLabel>
                        <Input
                          value={transitionFormData.assignee || ""}
                          onChange={(e) =>
                            setTransitionFormData((prev) => ({
                              ...prev,
                              assignee: e.target.value,
                            }))
                          }
                          autoComplete="off"
                          borderColor="gray.300"
                          _hover={{ borderColor: "brandScheme.400" }}
                          _focus={{ borderColor: "brandScheme.400" }}
                          backgroundColor="white"
                        />
                        {userSuggestions.length > 0 && (
                          <Box
                            mt={1}
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="md"
                            maxHeight="200px"
                            overflowY="auto"
                            bg="white"
                            zIndex={10}
                            position="absolute"
                            width="100%"
                          >
                            <List spacing={1}>
                              {userSuggestions.map((user) => (
                                <ListItem
                                  key={user.id}
                                  px={3}
                                  py={1}
                                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                                  onClick={() => {
                                    setTransitionFormData((prev) => ({
                                      ...prev,
                                      assignee: user.username,
                                    }));
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
                    );
                  }
                  if (trimmedField.toLowerCase() === "comments") {
                    return (
                      <FormControl key={trimmedField} isRequired>
                        <FormLabel>
                          {trimmedField} <span style={{ color: "red" }}>*</span>
                        </FormLabel>
                        <ReactQuill
                          theme="snow"
                          value={transitionFormData.comments || ""}
                          onChange={(content) =>
                            setTransitionFormData((prev) => ({
                              ...prev,
                              comments: content,
                            }))
                          }
                        />
                      </FormControl>
                    );
                  }
                  return (
                    < FormControl key={trimmedField} isRequired >
                      <FormLabel>
                        {trimmedField} <span style={{ color: "red" }}>*</span>
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
                onClick={async () => {
                  const requiredFields =
                    transitionPopupData?.requiredFields
                      ?.split(",")
                      .map((f) => f.trim()) || [];

                  // Validate all required fields filled
                  // const isFormValid = requiredFields.every(
                  //   (field) => transitionFormData[field] && transitionFormData[field].toString().trim() !== ""
                  // );
                  const isFormValid = requiredFields.every((field) => {
                    const camelKey = toCamelCase(field);
                    const val =
                      transitionFormData[camelKey] ?? transitionFormData[field];
                    return val && val.toString().trim() !== "";
                  });

                  if (!isFormValid) {
                    toast.error("Please fill all required fields.");
                    return;
                  }

                  // Build payload for status transition API
                  const payload = {
                    issueId: id,
                    issueType: issueData.issueType,
                    status: transitionPopupData?.toStatus,
                  };

                  requiredFields.forEach((field) => {
                    const camelKey = toCamelCase(field);
                    payload[camelKey] = transitionFormData[field];
                  });

                  try {
                    // Submit main transition data
                    const response = await fetch(
                      "http://localhost:8080/api/crDataPush",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                      }
                    );

                    if (!response.ok) {
                      throw new Error("Failed to submit the form.");
                    }

                    // If comments present, submit comment in separate API call
                    if (transitionFormData.comment) {
                      await axios.post(
                        "http://localhost:8080/api/comments/postCommentByIssueId",
                        {
                          issueId: id,
                          comment: transitionFormData.comments,
                          timestamp: getISTDateTime(),
                          commentBy: username,
                        }
                      );
                    }

                    toast.success("Status Transition Successful!");
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

              <Button
                variant="ghost"
                onClick={() => {
                  setTransitionFormData({});
                  setIsTransitionPopupOpen(false);
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box >
    </Card >
  );
}