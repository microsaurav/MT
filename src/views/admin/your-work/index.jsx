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
  GridItem,
  Badge,
  Heading,
  Grid
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
  LuCheckCheck,
  LuTimer
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
import { HSeparator } from 'components/separator/Separator';

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
      let data = response.data;

      if (!Array.isArray(data)) {
        if (data.comments && Array.isArray(data.comments)) {
          data = data.comments;
        } else {
          data = [data];
        }
      }

      const formatted = data.map((c) => ({
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
        console.log("API response data:", response.data);
        setIssueData(response.data);
        setStatus(response.data.status || "Open");

        let initialFields;
        if (response.data.issueType === "Defect") {
          initialFields = {
            "Description": response.data.description || "NA",
            "Steps to Reproduce": response.data.stepsToReproduce || "NA",
            "Expected Output": response.data.expectedOutput || "NA",
            "Actual Output": response.data.actualOutput || "NA",
            "Severity": response.data.severity || "",
            "Priority": response.data.priority || "",
          };
        } else {
          initialFields = {
            "Description": response.data.description || "NA",
            // "In Scope": response.data.inScope || "NA",
            // "Out Scope": response.data.outScope || "NA",
            "Qualitative Benefits": response.data.qualitativeBenefits || "NA",
            "Quantitative Benefits": response.data.quantitativeBenefits || "NA",
            "Severity": response.data.severity || "",
            "Priority": response.data.priority || "",
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
    if (!filename || typeof filename !== 'string') return "";
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
      let data = response.data;

      // If data is not an array, try to extract array from a property or wrap in array
      if (!Array.isArray(data)) {
        if (data.attachments && Array.isArray(data.attachments)) {
          data = data.attachments;
        } else {
          data = [data];
        }
      }

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
    <Card mt={{ base: "130px", md: "15px", xl: "15px" }}
      maxH="470px" position="relative" overflowY="scroll" bg="transparent" className="container" border="none" boxShadow="none">
      <Card bg="transparent" className='overview-card'>
        <Text fontSize="15px" fontWeight="500">Activity</Text>
        <Box m={0} w="100%" mt={2}>
          <Tabs index={tabIndex} onChange={(index, event) => handleTabChange(index, event)} variant="unstyled" defaultIndex={0} w="100%">
            <TabList border="1px solid #dfe1e6" borderRadius="6px" bg="white" mb={2} pb={0}>
              {[
                { label: "Overview", icon: LuUser },
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
                { label: "Effort Estimation", icon: LuTimer },
              ].map((tab, idx) => (
                <Tab
                  key={idx}
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
            </TabList>
            <TabPanels w="100%">
              <TabPanel p={0}>
                <Card p={2} mb={2}>
                  {/* <SimpleGrid columns={{ base: 1, md: 6 }} spacing={2}>
                    {[
                      { label: "CR Title / ID", field: "issueId" },
                      { label: "Product Type", field: "productType" },
                      { label: "Status", field: "status" },
                      { label: "Work Type", field: "issueType" },
                    ].map(({ label, field }) => {
                      return (
                        <Box key={field} justifyItems="center">
                          <Text fontSize="15px">{label}</Text>
                          <Editable
                            fontSize="14px"
                            textAlign="start"
                            value={issueData[field] || editableFields[field]}
                            onSubmit={(val) => handleFieldChange(field, val)}
                            onChange={(val) => setEditableFields((prev) => ({ ...prev, [field]: val }))}
                          >
                            <EditablePreview />
                            <EditableInput />
                          </Editable>
                        </Box>
                      );
                    })}
                    <Box justifyItems="center">
                      <Text fontSize="15px">Severity</Text>
                      <Badge fontSize="14px" bg={{
                        'Blocker': '#7f1d1d',  // red.900
                        'Critical': '#dc2626', // red.600
                        'High': '#fecaca',     // red.200
                        'Medium': '#facc15',   // yellow.400
                        'Low': '#a0aec0'       // gray.400
                      }[editableFields["Severity"]] || '#a0aec0'} color="black">
                        {editableFields["Severity"]}
                      </Badge>
                    </Box>
                    <Box justifyItems="center">
                      <Text fontSize="15px">Priority</Text>
                      <Badge fontSize="14px" bg={{
                        'Low': '#48bb78',      // green.400
                        'Medium': '#facc15',   // yellow.400
                        'High': '#dc2626',     // red.600
                        'Regulatory': '#3b82f6', // blue.500
                        'Rush Order': '#b91c1c'  // red.800
                      }[editableFields["Priority"]] || '#a0aec0'} color="black">
                        {editableFields["Priority"]}
                      </Badge>
                    </Box>
                  </SimpleGrid> */}
                  {issueData.workType === 'Defect' ? (
                    <>
                      <Box key="summary" mb={1}>
                        <Text fontSize="15px">Summary</Text>
                        <Editable p={0}
                          fontSize="14px"
                          textAlign="start"
                          value={issueData["summary"] || editableFields["summary"]}
                          onSubmit={(val) => handleFieldChange("summary", val)}
                          onChange={(val) => setEditableFields((prev) => ({ ...prev, ["summary"]: val }))}
                        >
                          <EditablePreview />
                          <EditableInput />
                        </Editable>
                      </Box>
                      <HSeparator />
                      <SimpleGrid columns={{ base: 1, md: 5 }} mt={1}>
                        {[
                          { label: "CR Title / ID", field: "issueId" },
                          // { label: "Summary", field: "summary" },
                          { label: "Work Type", field: "workType" },
                          { label: "Product Type", field: "productType" },
                          // { label: "Severity", field: "severity" },
                        ].map(({ label, field }) => {
                          return (
                            <Box key={field} justifyItems="center">
                              <Text fontSize="15px">{label}</Text>
                              <Editable
                                fontSize="14px"
                                textAlign="start"
                                value={issueData[field] || editableFields[field]}
                                onSubmit={(val) => handleFieldChange(field, val)}
                                onChange={(val) => setEditableFields((prev) => ({ ...prev, [field]: val }))}
                              >
                                <EditablePreview />
                                <EditableInput />
                              </Editable>
                            </Box>
                          );
                        })}
                        <Box justifyItems="center">
                          <Text fontSize="15px">Severity</Text>
                          <Badge fontSize="14px" bg={{
                            'Blocker': '#7f1d1d',  // red.900
                            'Critical': '#dc2626', // red.600
                            'High': '#fecaca',     // red.200
                            'Medium': '#facc15',   // yellow.400
                            'Low': '#a0aec0'       // gray.400
                          }[editableFields["Severity"]] || '#a0aec0'} color="white">
                            {editableFields["Severity"]}
                          </Badge>
                        </Box>
                        <Box justifyItems="center">
                          <Text fontSize="15px" >Status</Text>
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
                                  </MenuList>
                                </Menu>
                              </div>
                            </PopoverTrigger>
                          </Popover>
                        </Box>
                      </SimpleGrid>
                    </>
                  ) : (
                    <>
                      <Box key="summary" mb={1}>
                        <Text fontSize="15px">Project / CR Name</Text>
                        <Editable
                          fontSize="14px"
                          textAlign="start"
                          value={issueData["summary"] || editableFields["summary"]}
                          onSubmit={(val) => handleFieldChange("summary", val)}
                          onChange={(val) => setEditableFields((prev) => ({ ...prev, ["summary"]: val }))}
                        >
                          <EditablePreview />
                          <EditableInput />
                        </Editable>
                      </Box>
                      <HSeparator />
                      <SimpleGrid columns={{ base: 1, md: 4 }}>
                        {[
                          { label: "CR Title / ID", field: "issueId" },
                          // { label: "Project / CR Name", field: "summary" },
                          { label: "Work Type", field: "issueType" },
                          // { label: "Priority", field: "priority" },
                        ].map(({ label, field }) => {
                          return (
                            <Box key={field} justifyItems="center">
                              <Text fontSize="15px">{label}</Text>
                              <Editable
                                fontSize="14px"
                                textAlign="start"
                                value={issueData[field] || editableFields[field]}
                                onSubmit={(val) => handleFieldChange(field, val)}
                                onChange={(val) => setEditableFields((prev) => ({ ...prev, [field]: val }))}
                              >
                                <EditablePreview />
                                <EditableInput />
                              </Editable>
                            </Box>
                          );
                        })}
                        <Box justifyItems="center">
                          <Text fontSize="15px">Priority</Text>
                          <Badge fontSize="14px" bg={{
                            'Low': '#48bb78',      // green.400
                            'Medium': '#facc15',   // yellow.400
                            'High': '#dc2626',     // red.600
                            'Regulatory': '#3b82f6', // blue.500
                            'Rush Order': '#b91c1c'  // red.800
                          }[editableFields["Priority"]] || '#a0aec0'} color="black">
                            {editableFields["Priority"]}
                          </Badge>
                        </Box>
                        <Box>
                          <Text fontSize="14px">Status</Text>
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


                                  </MenuList>
                                </Menu>
                              </div>

                            </PopoverTrigger>
                          </Popover>
                        </Box>
                      </SimpleGrid>
                    </>
                  )}
                  <HSeparator my={1} />
                  <Box>
                    <Text sx={{
                      margin: 0,
                      fomfontSize: "15px"
                    }}>Description</Text>
                    <Editable fontSize="14px"
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
                      <EditablePreview />
                      <EditableInput />
                    </Editable>
                  </Box>
                </Card>
                <Flex gap={2}>
                  <Box flex="1">
                    <Card p={2}>
                      <Heading fontSize="15px" mb={0.5}>
                        Business Information
                      </Heading>
                      <HSeparator />
                      <SimpleGrid columns={2} spacing={1} fontSize="14px">
                        <Text>Responsible Function</Text>
                        <Text>{issueData.responsibleFunction || ''}</Text>
                        <Text>Sub Function</Text>
                        <Text>{issueData.subFunction || ''}</Text>
                        <Text>Business Module</Text>
                        <Text>{issueData.module || ''}</Text>
                        <Text>Business Type</Text>
                        <Text>{issueData.businessType || ''}</Text>
                        <Text>Qualitative Benefit</Text>
                        <Text>{issueData.qualitativeBenefits || ''}</Text>
                        <Text>Quantitative Benefit</Text>
                        <Text>{issueData.quantitativeBenefits || ''}</Text>
                        <Text>Benefit Value</Text>
                        <Text>{issueData.quantitativeBenefitValue || ''}</Text>
                      </SimpleGrid>
                    </Card>
                  </Box>
                  <Box flex="1">
                    <Card p={2}>
                      <Heading fontSize="15px" mb={0.5}>
                        Application Details
                      </Heading>
                      <HSeparator />
                      <SimpleGrid columns={2} spacing={1} fontSize="14px">
                        <Text>Application Name</Text>
                        <Text>{issueData.primaryApplication || 'App'}</Text>
                        <Text>Application Category</Text>
                        <Text>{issueData.applicationCategory || 'Something'}</Text>
                      </SimpleGrid>
                    </Card>
                    <Card p={2} mt={2}>
                      <Heading fontSize="15px" mb={0.5}>CR Status Reasons</Heading>
                      <HSeparator />
                      <SimpleGrid columns={2} spacing={1} fontSize="14px">
                        <Text>CR Dropped Reason</Text>
                        <Text>{issueData.droppedReason || 'Not Applicable'}</Text>
                        <Text>CR on Hold Reason</Text>
                        <Text>{issueData.onHoldReason || 'Awaiting Approval'}</Text>
                        <Text>Sub Function</Text>
                        <Text>{issueData.subFunction || 'UI/UX'}</Text>
                      </SimpleGrid>
                    </Card>
                  </Box>
                  <Box flex="1">
                    <Card p={2}>
                      <Heading fontSize="15px" mb={0.5}>Resource Allocation</Heading>
                      <HSeparator />
                      <SimpleGrid columns={2} spacing={1} fontSize="14px">
                        <Text>Assignee</Text>
                        <Text>{issueData.assignee || 'User'}</Text>
                        <Text>Business Analyst</Text>
                        <Text>{issueData.businessAnalyst || 'BA'}</Text>
                        <Text>Project Manager</Text>
                        <Text>{issueData.projectManager || 'BA'}</Text>
                        <Text>Developer</Text>
                        <Text>{issueData.developer || 'Dev'}</Text>
                        <Text>QA</Text>
                        <Text>{issueData.qa || 'QA'}</Text>
                        <Text>Release Manager</Text>
                        <Text>{issueData.releaseManager || 'Manager'}</Text>
                        <Text>VAPT Engineer</Text>
                        <Text>{issueData.vaptEngineer || 'VAPT'}</Text>
                      </SimpleGrid>
                    </Card>
                  </Box>
                </Flex>
                <Card mt={2}>
                  <Flex gap={2}>
                    <Box flex="1" p={2}>
                      <Heading fontSize="15px" mb={0.5}>
                        Comments
                      </Heading>
                      <HStack align="flex-start" spacing={3} ml={2} my={2}>
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
                        {comments.map((comment) => (
                          <Box key={comment.commentId} mb={4} borderBottom="1px solid #E2E8F0" pb={3}>
                            <HStack align="flex-start" spacing={3}>
                              <Avatar name={comment.author} size="sm" />
                              <Box flex="1">
                                <Text fontWeight="bold">{comment.author}</Text>
                                <Text fontSize="xs" color="gray.500" mb={1}>
                                  {comment.timestamp}
                                </Text>
                                {/* Edit Mode */}
                                {isEditing && editIndex === comment.commentId ? (
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
                                  {!(isEditing && editIndex === comment.commentId) && (
                                    <Button size="xs" variant="link" onClick={() => toggleReplyEditor(comment.commentId)}>Reply</Button>
                                  )}
                                  {comment.author === username && !isEditing && (
                                    <Button size="xs" variant="link" onClick={() => handleEditClick(comment.commentId)}>Edit</Button>
                                  )}
                                </HStack>
                                {/* Replies Section */}
                                {replyEditors[comment.commentId] && (
                                  <Box mt={2} ml={10}>
                                    <ReactQuill
                                      ref={replyQuillRefs.current[comment.commentId]}
                                      className="custom-quill"
                                      value={replyValues[comment.commentId] || ""}
                                      onChange={(val) => handleReplyChange(val, comment.commentId)}
                                      modules={modules}
                                      formats={formats}
                                      theme='snow'
                                      style={{ minHeight: 60, fontSize: "0.7rem" }}
                                    />
                                    <HStack mt={2}>
                                      <Button colorScheme='blue' size="xs" onClick={() => handleAddReply(comment.commentId)}>Submit</Button>
                                      <Button size="xs" variant="ghost" onClick={() => toggleReplyEditor(comment.commentId)}>Cancel</Button>
                                    </HStack>
                                  </Box>
                                )}
                                {/* Display Replies */}
                                {comment.replies && comment.replies.length > 0 && (
                                  <VStack spacing={3} mt={2} pl={6} align="stretch">
                                    {comment.replies.map((reply) => (
                                      <Box key={reply.commentId} p={2} bg="gray.50" borderRadius="md">
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
                    </Box>
                  </Flex>
                </Card>
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
                      <Th w="25%">Date Added</Th>
                      <Th whiteSpace="nowrap" textAlign="end" w="20%"></Th>
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
                          <Td textAlign="cwn" whiteSpace="nowrap">
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
      </Card>
    </Card >
  );

}