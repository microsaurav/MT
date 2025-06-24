import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Box,
  Text,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

function addDays(dateStr, days) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

const EffortEstimationTable = ({
  issueData,
  subTasks,
  linkedIssues,
  nestedChildCRs = [],
  dateDetails,
  allUsers,
}) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!issueData) return;
    console.log(issueData.issueId);
    
    // Determine if issue is parent or child based on issue_id format
    const isParentCR = /^[A-Za-z]+-\d+$/.test(issueData.issueId);
    console.log(isParentCR);
    const mainCR = {
      id: issueData.issueId,
      effortType: isParentCR ? "Main CR" : "Child CR",
      crNumber: issueData.issueId,
      applicationName: issueData.applicationName || "Multiple Applications",
      plannedStartDate: issueData.plannedStartDate || "",
      effortDays: issueData.effortDays || 0,
      plannedEndDate: issueData.plannedEndDate || "",
      resourceAssigned: issueData.resourceAssigned || "PM Team",
      notes: "",
      isChild: !isParentCR,
    };

    // Combine child CRs from subTasks, linkedIssues, and nestedChildCRs
    const combinedChildCRs = [...(subTasks || []), ...(nestedChildCRs || [])];

    const childCRs = combinedChildCRs.map((task, index) => {
      const plannedStartDate = task.plannedStartDate || "";
      const effortDays = task.effortDays || 0;
      const plannedEndDate = plannedStartDate
        ? addDays(plannedStartDate, effortDays)
        : "";

      return {
        id: task.issueId || `child-${index}`,
        effortType: "Child CR",
        crNumber: task.issueId || "",  // Print child CR number here
        applicationName: task.applicationName || "(Missing)",
        plannedStartDate,
        effortDays,
        plannedEndDate,
        resourceAssigned: task.resourceAssigned || "TBD",
        notes: plannedStartDate ? "" : "Start date missing ⚠️",
        isChild: true,
      };
    });

    setRows([mainCR, ...childCRs]);
  }, [issueData, subTasks, nestedChildCRs]);

  const handleChange = (id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          let updatedRow = { ...row, [field]: value };

          if (
            (field === "plannedStartDate" || field === "effortDays") &&
            updatedRow.plannedStartDate &&
            updatedRow.effortDays
          ) {
            const endDate = addDays(
              updatedRow.plannedStartDate,
              Number(updatedRow.effortDays)
            );
            updatedRow.plannedEndDate = endDate;
            updatedRow.notes = "";
          }

          if (!updatedRow.plannedStartDate) {
            updatedRow.plannedEndDate = "";
            updatedRow.notes = "Start date missing ⚠️";
          }

          return updatedRow;
        }
        return row;
      })
    );
  };

  const recalcAll = () => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.plannedStartDate && row.effortDays) {
          const endDate = addDays(row.plannedStartDate, Number(row.effortDays));
          return { ...row, plannedEndDate: endDate, notes: "" };
        } else if (!row.plannedStartDate) {
          return { ...row, plannedEndDate: "", notes: "Start date missing ⚠️" };
        }
        return row;
      })
    );
  };

  return (
    <Box>
      <Table variant="simple" size="sm" whiteSpace="nowrap">
        <Thead>
          <Tr
            style={{
              '& > th': {
                borderBottom: '2px solid',
                borderColor: 'gray.200',
                textAlign: "start",
                padding: "4px 8px",
                _hover: {
                  bg: 'gray.400',
                  cursor: 'pointer',
                },
              },
            }}
          >
            <Th>Effort Estimation Type</Th>
            <Th>CR Number</Th>
            <Th>Application Name</Th>
            <Th>Planned Start Date</Th>
            <Th>Effort (Days)</Th>
            <Th>Planned End Date</Th>
            <Th>Resource Assigned</Th>
            <Th>Notes / Issues</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row) => (
            <Tr key={row.id} bg={row.isChild ? "gray.50" : "white"}>
              <Td>{row.effortType}</Td>
              <Td>{row.crNumber}</Td>
              <Td>{row.applicationName}</Td>
              <Td>
                <Input
                  type="date"
                  value={row.plannedStartDate}
                  onChange={(e) =>
                    handleChange(row.id, "plannedStartDate", e.target.value)
                  }
                />
              </Td>
              <Td>
                <Input
                  type="number"
                  min={0}
                  value={row.effortDays}
                  onChange={(e) => handleChange(row.id, "effortDays", e.target.value)}
                />
              </Td>
              <Td>{formatDate(row.plannedEndDate)}</Td>
              <Td>
                <Input
                  value={row.resourceAssigned}
                  onChange={(e) =>
                    handleChange(row.id, "resourceAssigned", e.target.value)
                  }
                />
              </Td>
              <Td>
                {row.notes && (
                  <Tooltip label={row.notes} hasArrow>
                    <Box display="flex" alignItems="center" color="orange.500">
                      <Icon as={WarningIcon} mr={1} />
                      <Text fontSize="sm">{row.notes}</Text>
                    </Box>
                  </Tooltip>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box >
  );
};

export default EffortEstimationTable;
