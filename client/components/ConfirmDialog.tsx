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
  const { selectedChat, setSelectedChat, setNewChat } = ChatState();

  const handleConfirm = async () => {
    console.log("Confirmed!");
    if (!selectedChat) {
      const api = `https://pbl3-chatbot.onrender.com/api/user/deleteUser?id=${user._id}`;
      try {
        const response = await axios.delete(api);
        if (response) {
          console.log({
            message: "Delete successfully",
            payload: response,
          });
        }
      } catch (error) {
        console.error("Error fetching history:", error.message);
      }
    }
    if (selectedChat && selectedChat._id != 123) {
      console.log("««««« here »»»»»");
      const deleteUrl = `https://pbl3-chatbot.onrender.com/api/history/delete?id=${selectedChat._id}`;
      try {
        const response = await axios.delete(deleteUrl);
        // Kiểm tra trạng thái phản hồi (response status)
        if (response.status === 200) {
          setNewChat("123");
          console.log({
            message: "Delete successfully",
            payload: response,
          });
        } else {
          console.error(
            "Lỗi khi xóa. Trạng thái phản hồi không hợp lệ:",
            response.status
          );
        }
      } catch (error) {
        // Xử lý lỗi
        console.error("Lỗi khi gửi yêu cầu DELETE:", error.message);
      }
    }

    onClose();
    window.location.reload();
  };
  useEffect(() => {
    setSelectedChat(undefined);
  }, [user?.isAdmin]);
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
