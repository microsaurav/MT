import {
  Box,
  Flex,
  Input,
  Select,
  useColorModeValue
} from "@chakra-ui/react";
import { useState } from "react";

const getMasterData = () => {
  const stored = sessionStorage.getItem("masterData");
  return stored ? JSON.parse(stored) : {};
};

const TopFilters = ({ filters, setFilters }) => {
  const {
    issueId = "",
    primaryApplication = "",
    status = "",
    priority = "",
    severity = "",
    assignee = "",
    businessModule = "",
    businessType = "",
    issueType = "",
  } = filters;

  const inputBg = useColorModeValue("gray.50", "gray.600");
  const bgColor = useColorModeValue("white", "gray.700");
  const [options] = useState(getMasterData());

  const statusOptions = options?.Status || [];
  const priorityOptions = options?.Priority || [];
  const severityOptions = options?.Severity || [];
  const workTypeOptions = options?.WorkType || [];

  // Local state for issueId input to control input value
  const [localIssueId, setLocalIssueId] = useState(issueId);

  // Update local input state on change
  const handleIssueIdChange = (value) => {
    setLocalIssueId(value);
  };

  // Trigger filter update on Enter key press
  const handleIssueIdKeyDown = (e) => {
    if (e.key === "Enter") {
      setFilters({ ...filters, issueId: localIssueId });
    }
  };

  // Update other filters immediately on change
  const handleChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <Box p={2} mb={2} bg={bgColor} borderRadius="lg" shadow="md" w="100%">
      <Flex
        direction={{ base: "column", lg: "row" }}
        align="center"
        gap={1}
        wrap="wrap"
        justify="space-between"
      >
        <Input
          placeholder="CR Title / ID"
          size="sm"
          value={localIssueId}
          onChange={(e) => handleIssueIdChange(e.target.value)}
          onKeyDown={handleIssueIdKeyDown}
          bg={inputBg}
          w="100px"
          borderRadius="md"
        />
        <Input
          placeholder="Application Name"
          size="sm"
          value={primaryApplication}
          onChange={(e) => handleChange("primaryApplication", e.target.value)}
          bg={inputBg}
          borderRadius="md"
          w="130px"
        />
        <Input
          placeholder="Assignee"
          size="sm"
          value={assignee}
          onChange={(e) => handleChange("assignee", e.target.value)}
          bg={inputBg}
          borderRadius="md"
          w="95px"
        />
        <Select
          placeholder="Work Type"
          size="sm"
          bg={inputBg}
          borderRadius="md"
          w="110px"
          value={issueType}
          onChange={(e) => handleChange("issueType", e.target.value)}
        >
          {workTypeOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Select>
        <Select
          placeholder="Status"
          size="sm"
          bg={inputBg}
          borderRadius="md"
          w="100px"
          value={status}
          onChange={(e) => handleChange("status", e.target.value)}
        >

          {statusOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>

        <Select
          placeholder="Priority"
          size="sm"
          bg={inputBg}
          borderRadius="md"
          w="100px"
          value={priority}
          onChange={(e) => handleChange("priority", e.target.value)}
        >

          {priorityOptions.slice(1).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
        {issueType === "defect" && (
          <Select
            placeholder="Severity"
            size="sm"
            bg={inputBg}
            borderRadius="md"
            w="100px"
            value={severity}
            onChange={(e) => handleChange("severity", e.target.value)}
          >
            {severityOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        )}
        <Select
          placeholder="Business Module"
          size="sm"
          bg={inputBg}
          borderRadius="md"
          w="140px"
          value={businessModule}
          onChange={(e) => handleChange("businessModule", e.target.value)}
        >

          {options.businessModuleOptions?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Select>
        <Select
          placeholder="Business Type"
          size="sm"
          bg={inputBg}
          borderRadius="md"
          w="130px"
          value={businessType}
          onChange={(e) => handleChange("businessType", e.target.value)}
        >
          {options.businessTypeOptions?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Select>
      </Flex>
    </Box >
  );
};

export default TopFilters;
