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
import React, { useEffect, useRef } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { useHistory } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";

const IsolatedModal = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat } = ChatState();

  const handleConfirm = async () => {
    console.log("Confirmed!");
    if (selectedChat?._id) {
      console.log("««««« huybro »»»»»");
      const api = `https://pbl3-chatbot.onrender.com/api/user/deleteUser?id=${user._id}`;
      // try {
      //   const response = await axios.delete(api);
      //   if (response) {
      //     console.log("««««« response »»»»»", response);
      //   }
      // } catch (error) {
      //   console.error("Error fetching history:", error.message);
      // }
    }
    if (!selectedChat) {
      console.log("««««« here »»»»»");
    }

    onClose();
    // window.location.reload();
  };
  useEffect(() => {
    setSelectedChat(undefined);
  }, [user.isAdmin]);
  console.log("««««« ok »»»»»", selectedChat);
  return (
    <Box ml={2} as="section">
      <Button onClick={onOpen} fontSize="20px" colorScheme="red" p={0}>
        <MdOutlineDelete />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{/* {user.courseTitle} */}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you want to delete?</ModalBody>

          <ModalFooter display="flex" justifyContent="space-between">
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
