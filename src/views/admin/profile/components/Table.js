import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Center, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TableCustom = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem("userData"));
 
  const handleClick = (username, type) => {
    const query = type === 'Bug'
      ? `type=Bug`
      : `notType=Bug`;
    navigate(`/admin/search?assignee=${encodeURIComponent(username)}&${query}`);
  };
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/issuecountbyTeammember/${userData.username}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
  }, []);

  return (
    <Box maxWidth="100%" overflowX="auto">
      <Table variant="simple" width="full">
        <Thead>
          <Tr>
            <Th>Members</Th>
            <Th textAlign="center">Bug Count</Th>
            <Th textAlign="center">CR Count</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => (
            <Tr key={index}>
              <Td>{item.username}</Td>

              <Td
                textAlign="center"
                cursor="pointer"
                color="blue.500"
                onClick={() => handleClick(item.username, 'Bug')}
              >
                {item.bugCount}
              </Td>

              <Td
                textAlign="center"
                cursor="pointer"
                color="blue.500"
                onClick={() => handleClick(item.username, 'CR')}
              >
                {item.crCount}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TableCustom;
