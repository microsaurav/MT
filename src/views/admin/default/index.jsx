import {
  Avatar,
  Box,
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

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={GrInProgress} color={brandColor} />
              }
            />
          }
          name='In Progress'
          value='3'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Open'
          value='642'
        />
         <MiniStatistics
         
            // <Flex me='-16px' mt='10px'>
            //   <FormLabel htmlFor='balance'>
            //     <Avatar src={MdDeveloperMode} />
            //   </FormLabel>
              
            // </Flex>
            startContent={
              <IconBox
                w='56px'
                h='56px'
                bg={boxBg}
                icon={
                  <Icon w='32px' h='32px' as={MdDeveloperMode} color={brandColor} />
                }
              />
            }
          
          name='Under Development'
          value='10'
        />
        <MiniStatistics
         startContent={
          <IconBox
            w='56px'
            h='56px'
            bg={boxBg}
            icon={
              <Icon w='32px' h='32px' as={AiOutlineFileDone} color={brandColor} />
            }
          />
        }
            
          name='Development Completed'
          value='10'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
              icon={<Icon w='28px' h='28px' as={MdAddTask} color='white' />}
            />
          }
          name='Dev Completed'
          value='150'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name='Effort Estimation'
          value='29'
        />
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
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        {/* <MiniCalendar h='70%' minW='50%' selectRange={false} /> */}
      </SimpleGrid>
    </Box>
  );
}
