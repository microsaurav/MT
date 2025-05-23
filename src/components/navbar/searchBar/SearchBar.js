import React, { useState } from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

export function SearchBar(props) {
  const { variant, background, children, placeholder, borderRadius, ...rest } =
    props;

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    navigate(`/admin/view/${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm("");  // Clear the search term after navigation
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <InputGroup w={{ base: "100%", md: "200px" }} {...rest}>
      <InputLeftElement
        children={
          <IconButton
            bg="inherit"
            borderRadius="inherit"
            _hover={{ bg: "inherit" }}
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
            icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
            onClick={handleSearch}
            aria-label="Search"
          />
        }
      />
      <Input
        variant="search"
        fontSize="sm"
        bg={background ? background : inputBg}
        color={inputText}
        fontWeight="500"
        _placeholder={{ color: "gray.400", fontSize: "14px" }}
        borderRadius={borderRadius ? borderRadius : "30px"}
        placeholder={placeholder ? placeholder : "Search..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </InputGroup>
  );
}
