// phải để button MdOutlineDelete vào trong này, nếu để button vào navigation
// thì overlay sẽ màu đen => lỗi

import { Box, Button } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import React, { useRef } from "react";
import { MdOutlineDelete } from "react-icons/md";

const IsolatedModal = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleConfirm = () => {
    console.log("Confirmed!");
    onClose();
  };
  return (
    <Box as="section">
      <Button onClick={onOpen} size="sm">
        {/* {user.courseTitle} */}
        <MdOutlineDelete> </MdOutlineDelete>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{/* {user.courseTitle} */}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you want to delete?</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleConfirm}>
              Cancel
            </Button>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default IsolatedModal;
