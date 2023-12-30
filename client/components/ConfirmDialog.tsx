// phải để button MdOutlineDelete vào trong này, nếu để button vào navigation
// thì overlay sẽ màu đen => lỗi
import axios from "axios";
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
  const handleConfirm = async () => {
    console.log("Confirmed!");

    const api = `http://localhost:2001/api/user/deleteUser?id=${user._id}`;
    try {
      const response = await axios.delete(api);
      if (response) {
        console.log("««««« response »»»»»", response);
      }
    } catch (error) {
      console.error("Error fetching history:", error.message);
    }
    window.location.reload();
    onClose();
  };
  return (
    <Box ml={2} as="section">
      <Button onClick={onOpen} fontSize="20px" colorScheme="red" p={0}>
        {/* {user.courseTitle} */}
        <MdOutlineDelete />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{/* {user.courseTitle} */}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you want to delete?</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" mr={3} onClick={handleConfirm}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default IsolatedModal;
