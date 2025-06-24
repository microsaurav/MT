import React, { useState } from "react";
import {
  Select,
  Button,
  Divider,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const SubtaskPopup = ({ isOpen, onClose, data }) => {
  const [issueType, setIssueType] = useState("");
  const [summary, setSummary] = useState("");
  const [assignee, setAssignee] = useState("");
  const masterData = JSON.parse(sessionStorage.getItem("masterData"));
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const username = userData.username
  const subTaskOptions = masterData?.Subtask || [];
  console.log("Subtask is",subTaskOptions)
  const toast = useToast();

  if (!isOpen) return null;

  const handleCreateSubtask = async () => {
    const payload = {
      projectName: data.projectName,
      parentCR: data.issueId,
      workType: issueType,
      status: "Open",
      summary: summary,
      assignee: assignee,
      reporter:username,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/subtasks/PostSubtaskDetails",
        payload
      );
      toast({
        title: "Subtask created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error creating subtask:", error);
      toast({
        title: "Failed to create subtask.",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <div style={{ fontSize: "18px", fontWeight: 500 }}>
            Create Subtask
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <label>Issue Type</label>
              <Select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {subTaskOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>

            <Divider my={4} borderColor="gray.300" />

            <div>
              <label>Summary</label>
              <Input
                placeholder="Enter summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            <div>
              <label>Assignee</label>
              <Select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                <option value="">Select Assignee</option>
                <option value="saurav.kumar">Saurav Kumar</option>
                <option value="om.thange">Om Thange</option>
                <option value="prathamesh.kokane">Prathamesh Kokane</option>
              </Select>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: "10px", marginTop: "20px" }}>
          <Button
            onClick={handleCreateSubtask}
            size="sm"
            colorScheme="blue"
            borderRadius="4px"
          >
            Create
          </Button>

          <Button
            onClick={onClose}
            size="sm"
            variant="outline"
            borderRadius="4px"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

// Styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100,
};

const popupStyle = {
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "column",
  padding: "20px",
  gap: "15px",
  borderRadius: "8px",
  boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
  width: "100%",
  maxWidth: "500px",
};

export default SubtaskPopup;
