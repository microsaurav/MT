// Chakra imports
import { Text, useColorModeValue } from "@chakra-ui/react";
// Assets
import Project1 from "assets/img/profile/Project1.png";
import Project2 from "assets/img/profile/Project2.png";
import Project3 from "assets/img/profile/Project3.png";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
import Project from "views/admin/profile/components/Project";

export default function Projects(props) {
  const { gridColumn } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  return (
    <Card mb={{ base: "0px", "2xl": "20px" } }gridColumn={gridColumn}>
      <Text
        color={textColorPrimary}
        fontWeight='bold'
        fontSize='2xl'
        mt='10px'
        mb='4px'>
        Recent Task
      </Text>
      <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
        Here you can find more details about your projects.
      </Text>
      <Project
        boxShadow={cardShadow}
        mb='20px'
        ranking='1'
        title='Technology behind the Blockchain'
        id='IT-7886'
      />
      <Project
        boxShadow={cardShadow}
        mb='20px'
        
        ranking='2'
        id='IT-7884'
        title='Greatest way to a good Economy'
      />
      <Project
        boxShadow={cardShadow}
       mb='20px'
        ranking='3'
        id='IT-1234'
        title='Most essential tips for Burnout'
      />
      <Project
        boxShadow={cardShadow}
        mb='20px'
        ranking='4'
        id='IT-1234'
        title='Provider portal maintainance CR'
      />
      <Project
        boxShadow={cardShadow}
        mb='20px'
        ranking='4'
        id='IT-1234'
        title='Activ Fit modification'
      />

<Project
        boxShadow={cardShadow}
        mb='20px'
        ranking='4'
        id='IT-1234'
        title='Activ Health modification'
      />
     
    </Card>
  );
}
