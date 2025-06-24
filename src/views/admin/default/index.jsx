import {
  Avatar,
  Box,
  Card,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdDeveloperMode,
  MdFileCopy,
} from "react-icons/md";
import { GrInProgress } from "react-icons/gr";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import PieCardWorkstream from "views/admin/default/components/PieCardWorkstream";
import { AiOutlineFileDone } from "react-icons/ai";
import {
  useState, useEffect
} from "react";
import axios from "axios";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import ProdDefects from "views/admin/default/components/ProdDefects";
import NonProdDefects from "views/admin/default/components/NonProdDefects";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";
import { useNavigate } from "react-router-dom";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const [stats, setStats] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch data from API
    axios
      .get('http://localhost:8080/api/issuecountbystatus')
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  const iconMap = {
    'Open': MdBarChart,
    'CR Approved': MdAddTask,
    'Development in Progress': GrInProgress,
    'QA Testing': AiOutlineFileDone,
    'TSD Creation': MdFileCopy,
    'UAT': MdDeveloperMode,
  };

  return (
    <Card
      // maxH="410px"
      // overflowY="auto"
      // className="container"
      // borderRadius="16px"
      // bg="none"
      mt={{ base: '130px', md: '55px', xl: '55px' }}
      p={0}
      position="relative"
      maxH="430px"
      borderRadius="16px"
    >
      <Box
        // pt={{ base: '130px', md: '55px', xl: '55px' }} position="relative"
        overflowY="auto"
        className="container"
      >
        <Box m={{ base: '10px', lg: '15px' }}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }} gap="20px" mb="20px">
            {stats.map((item, index) => {
              const IconComponent = iconMap[item.category] || MdBarChart; // Default to MdBarChart if category not found
              const handleClick = () => {
                // Navigate to /admin/search with query param
                navigate(`/admin/search?status=${encodeURIComponent(item.category)}`);
              };
              return (
                <Box key={index} cursor="pointer" onClick={handleClick}>
                  <MiniStatistics
                    // onClick={handleClick}
                    key={index}
                    startContent={
                      <IconBox
                        w="56px"
                        h="56px"
                        bg={boxBg}
                        icon={<Icon w="32px" h="32px" as={IconComponent} color={brandColor} />}
                      />
                    }
                    name={item.category}
                    value={item.count.toString()}
                  />
                </Box>

              );
            })}
          </SimpleGrid>
          <SimpleGrid
            columns={{ base: 1, md: 1, xl: 2 }}
            gap="20px"
            mb="20px">
            {/* First PieCard */}
            <PieCard
              colSpan={{ base: 1, md: 2 }}
              h={{ base: "300px", md: "400px", xl: "500px" }}

            />

            {/* Second PieCard */}
            <PieCardWorkstream
              colSpan={{ base: 1, md: 2 }}
              h={{ base: "300px", md: "400px", xl: "500px" }}

            />
          </SimpleGrid>


          <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
            <ComplexTable
            // columnsData={columnsDataComplex}
            // tableData={tableDataComplex}
            />
            {/* <MiniCalendar h='70%' minW='50%' selectRange={false} /> */}
          </SimpleGrid>
        </Box>
      </Box>
    </Card>
  );
}
