// Table.js
import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const TableCustom = () => {
  return (
    <Box maxWidth="100%">
      <Table overflowX="auto"  variant="simple" width="full">
        <Thead>
          <Tr>
            <Th>Members</Th>
            <Th>Production</Th>
            <Th>UAT</Th>
            <Th>UP</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Akshita</Td>
            <Td>10</Td>
            <Td>10</Td>
            <Td>10</Td>
          </Tr>
          <Tr>
            <Td>Swangi</Td>
            <Td>101</Td>
            <Td>101</Td>
            <Td>101</Td>
          </Tr>
          <Tr>
            <Td>Anushree</Td>
            <Td>110</Td>
            <Td>110</Td>
            <Td>110</Td>
          </Tr>
          <Tr>
            <Td>Prathmesh</Td>
            <Td>10</Td>
            <Td>10</Td>
            <Td>10</Td>
          </Tr>
          <Tr>
            <Td>Om</Td>
            <Td>20</Td>
            <Td>10</Td>
            <Td>500</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default TableCustom;
