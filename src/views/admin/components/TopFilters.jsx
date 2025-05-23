import {
    Box,
    Flex,
    Input,
    Select,
    InputGroup,
    InputRightElement,
    IconButton,
    useColorModeValue,
  } from "@chakra-ui/react";
  import { SearchIcon } from "@chakra-ui/icons";
  
  const TopFilters = ({ filters, setFilters }) => {
    const {
      assignee = "",
      status = "",
      type = "",
      priority = "",
      search = "", // note: matches query param key 'search'
      project = "",
    } = filters;
  
    const inputBg = useColorModeValue("gray.50", "gray.600");
    const bgColor = useColorModeValue("white", "gray.700");
  
    // Update filter key locally and trigger URL update on demand
    const handleChange = (key, value) => {
      setFilters({ ...filters, [key]: value });
    };
  
    // Trigger search update (refresh URL with current filters)
    const handleSearch = () => {
      setFilters({ ...filters }); // trigger URL update with current filter values
    };
  
    // Handle Enter key in search input
    const handleKeyDown = (e) => {
      if (e.key === "Enter") handleSearch();
    };
  
    return (
      <Box p={4} mb={4} bg={bgColor} borderRadius="lg" shadow="md" w="100%">
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          gap={3}
          wrap="wrap"
          justify="space-between"
        >
          <InputGroup size="sm" maxW={{ base: "100%", lg: "250px" }}>
            <Input
              placeholder="Search issues..."
              value={search}
              onChange={(e) => handleChange("search", e.target.value)}
              onKeyDown={handleKeyDown}
              bg={inputBg}
              borderRadius="md"
            />
            <InputRightElement>
              <IconButton
                icon={<SearchIcon />}
                size="sm"
                variant="ghost"
                aria-label="Search"
                onClick={handleSearch}
              />
            </InputRightElement>
          </InputGroup>
  
          <Flex gap={3} wrap="wrap" justify="flex-start" w={{ base: "100%", lg: "auto" }}>
            <Select
              placeholder="Project"
              size="sm"
              bg={inputBg}
              borderRadius="md"
              w="150px"
              value={project}
              onChange={(e) => handleChange("project", e.target.value)}
            >
              <option value="donut-plains">Donut Plains</option>
            </Select>
  
            <Select
              placeholder="Type"
              size="sm"
              bg={inputBg}
              borderRadius="md"
              w="120px"
              value={type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <option value="Bug">Bug</option>
              <option value="Task">Task</option>
            </Select>
  
            <Select
              placeholder="Status"
              size="sm"
              bg={inputBg}
              borderRadius="md"
              w="120px"
              value={status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="open">Open</option>
              <option value="Done">Done</option>
              <option value="UAT">UAT</option>
            </Select>
  
            <Select
              placeholder="Assignee"
              size="sm"
              bg={inputBg}
              borderRadius="md"
              w="150px"
              value={assignee}
              onChange={(e) => handleChange("assignee", e.target.value)}
            >
              <option value="akshita.gupta2">Akshita Gupta</option>
              <option value="saurav.kumar10">Saurav Kumar</option>
              <option value="mangesh.katkar">Mangesh Katkar</option>
            </Select>
          </Flex>
        </Flex>
      </Box>
    );
  };
  
  export default TopFilters;
  