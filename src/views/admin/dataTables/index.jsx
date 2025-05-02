// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import DevelopmentTable from "views/admin/dataTables/components/DevelopmentTable";
import CheckTable from "views/admin/dataTables/components/CheckTable";
import ColumnsTable from "views/admin/dataTables/components/ColumnsTable";
import ComplexTable from "views/admin/dataTables/components/ComplexTable";
import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from "views/admin/dataTables/variables/columnsData";
import tableDataDevelopment from "views/admin/dataTables/variables/tableDataDevelopment.json";
import tableDataCheck from "views/admin/dataTables/variables/tableDataCheck.json";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
import tableDataComplex from "views/admin/dataTables/variables/tableDataComplex.json";
import ProdDefects from "views/admin/default/components/ProdDefects";
import NonProdDefects from "views/admin/default/components/NonProdDefects";
import React from "react";

export default function Settings() {
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
  mb="20px"
  columns={{ sm: 1, md: 2, xl:1 }}  // Adjust columns based on screen size
  spacing={{ base: "20px", xl: "20px" }}  // Set spacing between items
  w="100%"  // Ensure it takes up the full width
>
  <DevelopmentTable
    columnsData={columnsDataDevelopment}
    tableData={tableDataDevelopment}
  />
</SimpleGrid>

      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 2 }}
        spacing={{ base: "20px", xl: "20px" }}>
       < ProdDefects/>
        <NonProdDefects/>
      </SimpleGrid>
    </Box>
  );
}
