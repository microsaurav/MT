// /* eslint-disable */

// import {
//   Box,
//   Flex,
//   Icon,
//   Progress,
//   Table,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
//   useColorModeValue,
// } from '@chakra-ui/react';
// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from '@tanstack/react-table';
// import Card from 'components/card/Card';
// import Menu from 'components/menu/MainMenu';
// import * as React from 'react';
// import { MdCancel, MdCheckCircle, MdOutlineError } from 'react-icons/md';

// const columnHelper = createColumnHelper();

// // const columns = columnsDataCheck;
// export default function ComplexTable(props) {
//   const { tableData } = props;
//   const [sorting, setSorting] = React.useState([]);
//   const textColor = useColorModeValue('secondaryGray.900', 'white');
//   const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
//   let defaultData = tableData;
//   const columns = [
//     columnHelper.accessor('name', {
//       id: 'name',
//       header: () => (
//         <Text
//           justifyContent="space-between"
//           align="center"
//           fontSize={{ sm: '10px', lg: '12px' }}
//           color="gray.400"
//         >
//           Teams
//         </Text>
//       ),
//       cell: (info) => (
//         <Flex align="center">
//           <Text color={textColor} fontSize="sm" fontWeight="700">
//             {info.getValue()}
//           </Text>
//         </Flex>
//       ),
//     }),
//     columnHelper.accessor('status', {
//       id: 'status',
//       header: () => (
//         <Text
//           justifyContent="space-between"
//           align="center"
//           fontSize={{ sm: '10px', lg: '12px' }}
//           color="gray.400"
//         >
//           Number of CRs
//         </Text>
//       ),
//       cell: (info) => (
//         <Flex align="center">
//           {/* <Icon
//             w="24px"
//             h="24px"
//             me="5px"
//             color={
//               info.getValue() === 'Approved'
//                 ? 'green.500'
//                 : info.getValue() === 'Disable'
//                 ? 'red.500'
//                 : info.getValue() === 'Error'
//                 ? 'orange.500'
//                 : null
//             }
//             as={
//               info.getValue() === 'Approved'
//                 ? MdCheckCircle
//                 : info.getValue() === 'Disable'
//                 ? MdCancel
//                 : info.getValue() === 'Error'
//                 ? MdOutlineError
//                 : null
//             }
//           /> */}
//           <Text color={textColor} fontSize="sm" fontWeight="700">
//             {info.getValue()}
//           </Text>
//         </Flex>
//       ),
//     }),
   
//   ];
//   const [data, setData] = React.useState(() => [...defaultData]);
//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//     },
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     debugTable: true,
//   });
//   return (
//     <Card
//       flexDirection="column"
//       w="100%"
//       px="0px"
//       overflowX={{ sm: 'scroll', lg: 'hidden' }}
//     >
//       <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
//         <Text
//           color={textColor}
//           fontSize="22px"
//           fontWeight="700"
//           lineHeight="100%"
//         >
//           CR's as per team
//         </Text>
//         {/* <Menu /> */}
//       </Flex>
//       <Box>
//         <Table variant="simple" color="gray.500" mb="24px" mt="12px">
//           <Thead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <Tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <Th
//                       key={header.id}
//                       colSpan={header.colSpan}
//                       pe="10px"
//                       borderColor={borderColor}
//                       cursor="pointer"
//                       onClick={header.column.getToggleSortingHandler()}
//                     >
//                       <Flex
//                         justifyContent="space-between"
//                         align="center"
//                         fontSize={{ sm: '10px', lg: '12px' }}
//                         color="gray.400"
//                       >
//                         {flexRender(
//                           header.column.columnDef.header,
//                           header.getContext(),
//                         )}
//                         {{
//                           asc: '',
//                           desc: '',
//                         }[header.column.getIsSorted()] ?? null}
//                       </Flex>
//                     </Th>
//                   );
//                 })}
//               </Tr>
//             ))}
//           </Thead>
//           <Tbody>
//             {table
//               .getRowModel()
//               .rows.slice(0, 5)
//               .map((row) => {
//                 return (
//                   <Tr key={row.id}>
//                     {row.getVisibleCells().map((cell) => {
//                       return (
//                         <Td
//                           key={cell.id}
//                           fontSize={{ sm: '14px' }}
//                           minW={{ sm: '150px', md: '200px', lg: 'auto' }}
//                           borderColor="transparent"
//                         >
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext(),
//                           )}
//                         </Td>
//                       );
//                     })}
//                   </Tr>
//                 );
//               })}
//           </Tbody>
//         </Table>
//       </Box>
//     </Card>
//   );
// }
/* eslint-disable */

import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Card from 'components/card/Card';
// import Menu from 'components/menu/MainMenu'; // if unused, remove it
import * as React from 'react';
import axios from 'axios';

const columnHelper = createColumnHelper();

export default function ComplexTable() {
  const [data, setData] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Fetch data from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/CRcountbyteam");
        // Transform the data to match expected format
        const transformedData = response.data.map(item => ({
          name: item.category,
          status: item.count,
        }));
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching CR count by team:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          Teams
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          Number of CRs
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700">
          CR's as per team
        </Text>
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    pe="10px"
                    borderColor={borderColor}
                    cursor="pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Flex justifyContent="space-between" align="center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.slice(0, 5).map(row => (
              <Tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <Td
                    key={cell.id}
                    fontSize={{ sm: '14px' }}
                    minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                    borderColor="transparent"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
