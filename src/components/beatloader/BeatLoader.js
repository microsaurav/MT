import React from 'react';
import { Box, keyframes } from '@chakra-ui/react';

const beat = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.6;
  }
`;

const BeatLoader = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="40px" gap="6px">
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          width="10px"
          height="10px"
          bg="blue.500"
          borderRadius="50%"
          animation={`${beat} 0.6s ease-in-out infinite`}
          animationDelay={`${i * 0.2}s`}
        />
      ))}
    </Box>
  );
};

export default BeatLoader;
