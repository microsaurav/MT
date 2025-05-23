import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  ButtonGroup,
  Flex,
  Text,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "./Loading";

const ITEMS_PER_PAGE = 10;

const IssueTable = ({ filters }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const bg = useColorModeValue("white", "gray.700");
  const headerBg = useColorModeValue("gray.100", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.400");

  const [activeFilters, setActiveFilters] = useState({});

  // Parse all query params into filters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = {};
    for (const [key, value] of params.entries()) {
      newFilters[key] = value;
    }
    setActiveFilters(newFilters);
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        for (const key in activeFilters) {
          if (activeFilters[key]) {
            params.append(key, activeFilters[key]);
          }
        }

        let response;
        if (params.toString()) {
          response = await axios.get(`http://localhost:8080/api/tasks?${params}`);
        } else {
          response = await axios.get("http://localhost:8080/api/GetIssuedetails");
        }

        setIssues(response.data || []);
        setError("");
      } catch (err) {
        console.error("Failed to fetch issues:", err);
        setError("Unable to fetch issue details.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [activeFilters, filters.triggerSearch]);

  const totalPages = Math.ceil(issues.length / ITEMS_PER_PAGE);
  const paginatedData = issues.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (loading) return <Loading />;
  if (error)
    return (
      <Center h="50vh">
        <Text color="red.500">{error}</Text>
      </Center>
    );

  return (
    <Box p={4} bg={bg} shadow="md" borderRadius="lg" overflow="hidden">
      <Box overflow="auto" maxH="70vh">
        <Table variant="striped" size="sm" minW="1500px" color={textColor}>
          <Thead position="sticky" top={0} bg={headerBg} zIndex={0.5}>
            <Tr>
              {[
                "Issue ID", "Type", "Status", "Priority", "Workstream", "Defect Type",
                "Product Type", "Primary App", "Summary", "Description", "Linked Issue",
                "Severity", "Environment", "Impacted Systems", "Module", "Assignee",
                "Steps", "Actual Output", "Expected Output", "#TC Impacted", "CR Name",
                "Business Owner", "In Scope", "Out Scope", "Need", "Benefits",
                "Child CR Reason", "Parent CR", "Project Name", "BIU Dashboard",
                "Attachment", "GTM Plan", "Justification",
              ].map((label, i) => (
                <Th key={i} whiteSpace="nowrap" color={textColor}>
                  {label}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.map((issue, i) => (
              <Tr key={issue.issueId || i}>
                <Td>
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => navigate(`/admin/view/${issue.issueId}`)}
                  >
                    {issue.issueId}
                  </Text>
                </Td>
                <Td>{issue.issueType}</Td>
                <Td>
                  <Badge colorScheme={issue.status === "Open" ? "blue" : "green"}>
                    {issue.status}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme="red">{issue.priority}</Badge>
                </Td>
                <Td>{issue.workstreamStreamAndBusinessFunction}</Td>
                <Td>{issue.defectType || "-"}</Td>
                <Td>{issue.productType || "-"}</Td>
                <Td>{issue.primaryApplication || "-"}</Td>
                <Td>{issue.summary}</Td>
                <Td>{issue.description}</Td>
                <Td>{issue.linkedIssue || "-"}</Td>
                <Td>{issue.severity || "-"}</Td>
                <Td>{issue.environment || "-"}</Td>
                <Td>{issue.impactedSystems || "-"}</Td>
                <Td>{issue.module}</Td>
                <Td>{issue.assignee}</Td>
                <Td>{issue.stepsToReproduce || "-"}</Td>
                <Td>{issue.actualOutput || "-"}</Td>
                <Td>{issue.expectedOutput || "-"}</Td>
                <Td>{issue.noOfTestCaseImpacted || "-"}</Td>
                <Td>{issue.crName}</Td>
                <Td>{issue.businessOwner}</Td>
                <Td>{issue.inScope}</Td>
                <Td>{issue.outScope}</Td>
                <Td>{issue.businessNeed}</Td>
                <Td>{issue.businessNeedBenefitsDetails}</Td>
                <Td>{issue.reasonForRaisingChildCR || "-"}</Td>
                <Td>{issue.parentCR || "-"}</Td>
                <Td>{issue.projectName}</Td>
                <Td>{issue.biudashboardNeeded ? "Yes" : "No"}</Td>
                <Td>{issue.attachment || "-"}</Td>
                <Td>{issue.gtmplanNeeded ? "Yes" : "No"}</Td>
                <Td>{issue.justification}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex justify="space-between" align="center" mt={4} flexWrap="wrap">
        <Text fontSize="sm" color={subTextColor}>
          Showing {ITEMS_PER_PAGE * (page - 1) + 1} -{" "}
          {Math.min(page * ITEMS_PER_PAGE, issues.length)} of {issues.length}
        </Text>
        <ButtonGroup size="sm" isAttached>
          <Button onClick={() => setPage(Math.max(1, page - 1))} isDisabled={page === 1}>
            Previous
          </Button>
          <Button isDisabled>{`Page ${page} of ${totalPages}`}</Button>
          <Button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            isDisabled={page === totalPages}
          >
            Next
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};

export default IssueTable;
