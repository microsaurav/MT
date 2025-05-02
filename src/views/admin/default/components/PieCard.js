// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import { pieChartData, pieChartOptions } from "variables/charts";
import { VSeparator } from "components/separator/Separator";
import React from "react";

export default function Conversion(props) {
  const { ...rest } = props;
  const { colSpan } = props;
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  return (
    
    <Card p='20px' align='center' direction='column' w='100%' {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent='space-between'
        alignItems='center'
        w='100%'
        mb='8px'>
        <Text color={textColor} fontSize='md' fontWeight='600' mt='4px'>
          CR's Based on Business Outcome
        </Text>
       
      </Flex>

      <Flex
    w="100%"
    h={{ base: "300px", md: "400px", xl: "500px" }}  // You can adjust the height as needed
    justifyContent="center"
    alignItems="center"
  >
    <PieChart
      h="100%"
      w="100%"
      chartData={pieChartData}
      chartOptions={pieChartOptions}
    />
  </Flex>
      
    </Card>

  );
}
