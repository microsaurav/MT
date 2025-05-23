// Chakra imports
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Conversion(props) {
  const { ...rest } = props;
  const { colSpan } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");

  // State for chart data
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    labels: [],
    colors: [],
    chart: { width: "50px" },
    states: { hover: { filter: { type: "none" } } },
    legend: { show: false },
    dataLabels: { enabled: false },
    hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: { labels: { show: false } },
      },
    },
    fill: { colors: [] },
    tooltip: { enabled: true, theme: "dark" },
  });


  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/issuecountBybusinessoutcome");
        const apiData = response.data;
  
        const labels = apiData.map(item => item.category);
        const data = apiData.map(item => item.count);
  
        const dynamicColors = [
          "#003f5c",
          "#2f4b7c",
          "#665191",
          "#a05195",
          "#d45087",
          "#f95d6a",
          "#ff7c43",
          "#ffa600"
        ];
  
        // Cycle through colors if there are more labels than colors
        const colors = labels.map((_, index) => dynamicColors[index % dynamicColors.length]);
  
        setChartData(data);
        setChartOptions(prev => ({
          ...prev,
          labels,
          colors,
          fill: { colors },
        }));
      } catch (error) {
        console.error("Failed to fetch business outcome data", error);
      }
    };
  
    fetchChartData();
  }, []);
  
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
        h={{ base: "300px", md: "400px", xl: "500px" }}
        justifyContent="center"
        alignItems="center"
      >
        {chartData.length > 0 && chartData.reduce((sum, val) => sum + val, 0) > 0 ? (
          <PieChart
            h="100%"
            w="100%"
            chartData={chartData}
            chartOptions={chartOptions}
          />
        ) : (
          <Text color="gray.500" fontSize="sm">
            No data available to render chart.
          </Text>
        )}
      </Flex>

    </Card>
  );
}
