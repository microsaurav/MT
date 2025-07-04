import React, { useEffect, useState, useMemo } from "react";
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
  useBreakpointValue,
  Card,
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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const navigate = useNavigate();
  const location = useLocation();

  const bg = useColorModeValue("white", "gray.700");
  const headerBg = useColorModeValue("gray.100", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const isMobile = useBreakpointValue({ base: true, md: false });

  const severityStyles = {
    Blocker: { bg: "red.900", color: "white" },
    Critical: { bg: "red.600", color: "white" },
    High: { bg: "red.200", color: "black" },
    Medium: { bg: "yellow.300", color: "black" },
    Low: { bg: "green.300", color: "black" },
  };

  const priorityStyles = {
    Low: { bg: "green.300", color: "black" },
    Medium: { bg: "yellow.300", color: "black" },
    High: { bg: "red.500", color: "white" },
    Regulatory: { bg: "blue.400", color: "white" },
    "Rush Order": { bg: "red.900", color: "white" },
  };

  const columns = [
    { label: "CR Title / ID", width: "100px", key: "issueId" },
    { label: "Work Type", width: "85px", key: "issueType" },
    ...(isMobile ? [] : [
      { label: "Application Name", width: "120px", key: "primaryApplication" },
      { label: "Status", width: "90px", key: "status" },
      { label: "Priority", width: "100px", key: "priority" },
      { label: "Created Date", width: "100px", key: "createdDate" },
      { label: "Assignee", width: "95px", key: "assignee" },
      { label: "Business Module", width: "120px", key: "businessModule" },
      { label: "Business Type", width: "120px", key: "businessType" },
    ]),
    ...(filters.issueType === "Defect"
      ? [{ label: "Severity", width: "100px", key: "severity" }]
      : []),
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = {};
    for (const [key, value] of params.entries()) {
      newFilters[key] = value;
    }
    // setActiveFilters(newFilters);
    setPage(1);
    fetchIssues(newFilters);
  }, [location.search, filters.triggerSearch]);

  const fetchIssues = async (activeFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      for (const key in activeFilters) {
        if (activeFilters[key]) {
          params.append(key, activeFilters[key]);
        }
      }

      const url = params.toString()
        ? `http://localhost:8080/api/tasks?${params}`
        : "http://localhost:8080/api/GetIssuedetails";

      const response = await axios.get(url);
      setIssues(response.data || []);
      setError("");
    } catch (err) {
      console.error("Failed to fetch issues:", err);
      setError("Unable to fetch issue details.");
    } finally {
      setLoading(false);
    }
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return issues;
    return [...issues].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [issues, sortConfig]);

  const paginatedData = sortedData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  if (loading) return <Loading />;
  if (error)
    return (
      <Center h="50vh">
        <Text color="red.500">{error}</Text>
      </Center>
    );

  return (
    <Card p={2} bg={bg} shadow="md" borderRadius="lg" h="100%" overflow="hidden">
      <Box overflow="auto" maxH="100%">
        <Table variant="striped" size="sm" minW="700px" color={textColor}>
          <Thead position="sticky" top={0} bg={headerBg} zIndex={0.5}>
            <Tr>
              {columns.map(({ label, width, key }, i) => (
                <Th
                  whiteSpace="nowrap"
                  key={i}
                  color={textColor}
                  px="5px"
                  w={width}
                  cursor="pointer"
                  onClick={() => {
                    const direction =
                      sortConfig.key === key && sortConfig.direction === "asc"
                        ? "desc"
                        : "asc";
                    setSortConfig({ key, direction });
                  }}
                >
                  {label} {sortConfig.key === key ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.map((issue, i) => (
              <Tr key={issue.issueId || i} sx={{
                '& > td': {
                  // borderBottom: "1px solid gray",
                }
              }}>
                {columns.map(({ key, width }, j) => (
                  <Td key={j} p="5px" w={width}>
                    {key === "issueId" ? (
                      <Text
                        p="5px"
                        color="blue.500"
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                        onClick={() => navigate(`/admin/view/${issue.issueId}`)}
                      >
                        {issue[key]}
                      </Text>
                    ) : key === "priority" ? (
                      <Badge
                        bg={priorityStyles[issue[key]]?.bg || "gray.200"}
                        color={priorityStyles[issue[key]]?.color || "black"}
                      >
                        {issue[key]}
                      </Badge>
                    ) : key === "severity" ? (
                      <Badge
                        bg={severityStyles[issue[key]]?.bg}
                        color={severityStyles[issue[key]]?.color || "black"}
                      >
                        {issue[key]}
                      </Badge>
                    ) : key === "createdDate" ? (
                      issue[key] ? new Date(issue[key]).toLocaleDateString('en-GB') : ''
                    ) : (
                      issue[key]
                    )}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex justify="space-between" align="center" mt={2} flexWrap="wrap">
        <Text fontSize="sm" color={subTextColor}>
          Showing {ITEMS_PER_PAGE * (page - 1) + 1} -{" "}
          {Math.min(page * ITEMS_PER_PAGE, sortedData.length)} of {sortedData.length}
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
    </Card>
  );
};

export default IssueTable;
