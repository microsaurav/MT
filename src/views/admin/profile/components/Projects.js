// Chakra imports
import { Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, { useEffect, useState } from "react";
import Project from "views/admin/profile/components/Project";
import axios from "axios";

export default function Projects({ gridColumn }) {
  const [tasks, setTasks] = useState([]);

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/tasks?assignee=saurav.kumar10"
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <Card mb={{ base: "0px", "2xl": "20px" }} gridColumn={gridColumn}>
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb="4px"
      >
        Assigned to Me
      </Text>
      <Text color={textColorSecondary} fontSize="md" me="26px" mb="40px">
        Here you can find more details about your projects.
      </Text>

      {tasks.map((task, index) => (
        <Project
          key={task.id}
          boxShadow={cardShadow}
          mb="20px"
          ranking={(index + 1).toString()}
          title={task.summary || "No Summary"}
          id={task.issueId || `IT-${task.id}`}
        />
      ))}
    </Card>
  );
}
