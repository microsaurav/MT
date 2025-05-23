import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect } from "react";

const Loading = () => {
  const dotColor = useColorModeValue("blue.500", "blue.300");
  const overlayBg = useColorModeValue("rgba(255, 255, 255, 0.4)", "rgba(26, 32, 44, 0.4)");

  useEffect(() => {
    // Inject keyframes only once
    if (!document.getElementById("bounce-keyframes")) {
      const style = document.createElement("style");
      style.id = "bounce-keyframes";
      style.innerHTML = `
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.3;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bg={overlayBg}
      backdropFilter="blur(6px)"
      zIndex={9999}
    >
      <Flex h="100%" align="center" justify="center" gap={3}>
        {[0, 0.2, 0.4].map((delay, idx) => (
          <Box
            key={idx}
            w="16px"
            h="16px"
            borderRadius="50%"
            bg={dotColor}
            animation="bounce 1.2s infinite ease-in-out"
            animationDelay={`${delay}s`}
          />
        ))}
      </Flex>
    </Box>
  );
};

export default Loading;
