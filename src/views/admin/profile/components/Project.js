import {
  Box,
  Flex,
  Icon,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React from "react";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Project(props) {
  const { title, id, ranking, ...rest } = props;

  const navigate = useNavigate();

  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const brandColor = useColorModeValue("brand.500", "white");
  const bg = useColorModeValue("white", "navy.700");

  const handleClick = () => {
    navigate(`/admin/view/${encodeURIComponent(id)}`);
  };

  return (
    <Card bg={bg} {...rest} p="14px">
      <Flex align="center" direction={{ base: "column", md: "row" }}>
        <Box mt={{ base: "10px", md: "0" }}>
          <Text color={textColorPrimary} fontWeight="500" fontSize="md" mb="4px">
            {title}
          </Text>
          <Text fontWeight="500" color={textColorSecondary} fontSize="sm" me="4px">
            {id}{" "}
            <Link
              fontWeight="500"
              color={brandColor}
              fontSize="sm"
              cursor="pointer"
              onClick={handleClick}
            >
              See project details
            </Link>
          </Text>
        </Box>

        <Box
          as="button"
          onClick={handleClick}
          variant="ghost"
          me="16px"
          ms="auto"
          p="0px !important"
        >
          <Icon as={MdEdit} color="secondaryGray.500" h="18px" w="18px" />
        </Box>
      </Flex>
    </Card>
  );
}
