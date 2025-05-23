import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";

export default function Banner(props) {
  const { banner, avatar, name, bugCount, crCount } = props;
  const navigate = useNavigate();

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );

  // Navigate on click with username and type
  const handleClick = (username, type) => {
    const query = type === "Bug" ? `type=Bug` : `notType=Bug`;
    navigate(`/admin/search?assignee=${encodeURIComponent(username)}&${query}`);
  };

  return (
    <Card mb={{ base: "0px", lg: "20px" }} align="center">
      <Box
        bg={`url(${banner})`}
        bgSize="cover"
        borderRadius="16px"
        h="131px"
        w="100%"
      />
      <Avatar
        mx="auto"
        src={avatar}
        h="87px"
        w="87px"
        mt="-43px"
        border="4px solid"
        borderColor={borderColor}
      />
      <Text color={textColorPrimary} fontWeight="bold" fontSize="xl" mt="10px">
        {name}
      </Text>

      <Flex w="100%" justify="center" mt="10px" gap="60px">
      <Flex
  align="center"
  direction="column"
  cursor="pointer"
  onClick={() => handleClick(name, "Bug")}
>
  <Text
    color={textColorPrimary}
    fontSize="xl"
    fontWeight="500"
    _hover={{ textDecoration: "underline", color: "blue.500" }}
  >
    {bugCount}
  </Text>
  <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
    Bug Count
  </Text>
</Flex>

<Flex
  align="center"
  direction="column"
  cursor="pointer"
  onClick={() => handleClick(name, "CR")}
>
  <Text
    color={textColorPrimary}
    fontSize="xl"
    fontWeight="500"
    _hover={{ textDecoration: "underline", color: "blue.500" }}
  >
    {crCount}
  </Text>
  <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
    CR Count
  </Text>
</Flex>
      </Flex>
    </Card>
  );
}
