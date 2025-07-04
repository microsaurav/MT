import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FiFile } from 'react-icons/fi';

const getMimeType = (ext) => {
  switch (ext) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "pdf":
      return "application/pdf";
    case "txt":
      return "text/plain";
    case "json":
      return "application/json";
    case "csv":
      return "text/csv";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "xls":
      return "application/vnd.ms-excel";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    default:
      return "application/octet-stream";
  }
};

const getFileType = (filename) => {
  if (!filename || typeof filename !== 'string') return "";
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
};

const DocumentUploadView = ({ attachments }) => {
  const AttachmentCard = ({ attachment }) => {
    let isImage = false;
    let isTextFile = false;

    const filename = attachment.name || "";
    console.log("FileName: ", filename);
    const ext = getFileType(filename);
    console.log("File Type: ", ext);
    const mimeType = getMimeType(ext);
    console.log("Mime Type: ", mimeType);

    isImage = mimeType.startsWith("image/");
    isTextFile = mimeType.startsWith("text/");

    const previewUrl = isImage ? `data:${mimeType};base64,${attachment.base64}` : null;

    console.log("Image is: ", isImage);
    let textContent = null;
    if (isTextFile && attachment.base64) {
      try {
        textContent = atob(attachment.base64);
      } catch (e) {
        textContent = '';
      }
    }

    return (
      <VStack
        minW={{ base: '140px', md: '160px' }}
        maxW={{ base: '140px', md: '160px' }}
        h="200px"
        p={3}
        bg="gray.200"
        rounded="lg"
        shadow="md"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        spacing={2}
        flexShrink={0}
        transition="all 0.2s ease-in-out"
        _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      >
        <Text fontWeight="bold" fontSize="xs">{attachment.type}</Text>
        {/* File Preview */}
        <Flex
          w="full"
          h="100px"
          bg="gray.100"
          rounded="md"
          justify="center"
          align="center"
          overflow="hidden"
          shrink={0}
        >
          {isImage ? (
            <Image
              src={previewUrl || 'https://placehold.co/100x100/E2E8F0/FFFFFF?text=No+Preview'}
              alt={filename}
              objectFit="cover"
              w="full"
              h="full"
              rounded="md"
              fallbackSrc="https://placehold.co/100x100/E2E8F0/FFFFFF?text=Image+Error"
            />
          ) : isTextFile && textContent ? (
            <Text
              fontSize="xs"
              color="gray.600"
              overflow="hidden"
              whiteSpace="pre-wrap"
              noOfLines={5}
              p={2}
              w="full"
              h="full"
            >
              <Text noOfLines={5}>{textContent}</Text>
            </Text>
          ) : (
            <Icon as={FiFile} boxSize={8} color="gray.500" />
          )}
        </Flex>

        {/* File Info */}
        <VStack align="start" spacing={0} mt={2}>
          <Text fontSize="sm" fontWeight="medium" noOfLines={2}>
            {filename}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {attachment.uploadedAt}
          </Text>
        </VStack>
      </VStack>
    );
  };

  return (
    <Box
      w="full"
      overflowX="auto"
      pb={4}
    >
      <HStack display="flex" spacing={4} align="start">
        {attachments.map((attachment, index) => (
          <AttachmentCard key={attachment.id || attachment.name || index} attachment={attachment} />
        ))}
      </HStack>
    </Box>
  );
};

export default DocumentUploadView;
