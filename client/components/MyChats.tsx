import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { clsx } from "clsx";
import "./MyChats.css";
import { MdOutlineDelete } from "react-icons/md";
import IsolatedModal from "./ConfirmDialog";
import PerfectScrollbar from "react-perfect-scrollbar";

// import { styles } from "";
const MyChats = () => {
  const {
    selectedChat,
    setSelectedChat,
    newChat,
    setChatId,
    setSelectedChatHistory,
    selectedChatHistory,
  } = ChatState();

  const user = JSON.parse(localStorage.getItem("userInfo")!);

  interface Chat {
    _id: string;
    // Thêm các thuộc tính khác của chat
    question: string[];
    // Các thuộc tính khác nếu có
  }
  const [value, setValue] = useState<Chat[]>([]);

  const toast = useToast();

  const handleClick = (chat) => {
    localStorage.setItem("chat", JSON.stringify(chat));
    setSelectedChat(chat);
    setChatId(chat._id); // Lưu ID của chat (nếu cần)
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = user._id;
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const apiUrl = `https://pbl3-chatbot.onrender.com/api/history/get?id=${userId}`;
      try {
        const response = await axios.get(apiUrl, config);
        const allHistory = response.data;
        allHistory.unshift({ question: ["New chat", "new chat"], _id: "123" });
        setValue(allHistory);
        // Xử lý dữ liệu ở đây
      } catch (error) {
        console.error("Error fetching history:", error.message);
      }
    };

    fetchData(); // lấy lịch sử chat của user
  }, []);

  // reload lại trang khi có một đoạn chat mới ( chưa thử trên mô hình)
  useEffect(() => {
    const fetchData = async () => {
      const userId = user._id;
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const apiUrl = `https://pbl3-chatbot.onrender.com/api/history/get?id=${userId}`;
      try {
        const response = await axios.get(apiUrl, config);
        const allHistory = response.data;
        allHistory.unshift({ question: ["New chat", "new chat"], _id: "123" });
        setValue(allHistory);
        // Xử lý dữ liệu ở đây
      } catch (error) {
        console.error("Error fetching history:", error.message);
      }
    };

    fetchData(); // Gọi hàm fetchData ngay sau khi định nghĩa nó
  }, [newChat]);

  useEffect(() => {
    const historyChat = JSON.parse(localStorage.getItem("chat")!);

    if (!selectedChat) {
      setSelectedChat(historyChat);
    }
  }, []);

  console.log("«««««selectedChat  »»»»»", selectedChat);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      // display={{ base: "none", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "19.5%" }}
      h="100%"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        History
      </Box>
      <Box
        display="flex"
        flexDir="column"
        // p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        <PerfectScrollbar>
          {value ? (
            <Stack>
              {value.map((chat, index) => (
                <Box
                  key={index}
                  onClick={() => handleClick(chat)}
                  cursor="pointer"
                  // _hover={{ backgroundColor: "#F8F8F8" }}
                  bg={
                    selectedChat?._id == chat?._id ||
                    selectedChatHistory?._id == chat?._id
                      ? "#38B2AC"
                      : "#E8E8E8"
                  }
                  color={
                    selectedChat?._id == chat?._id ||
                    selectedChatHistory?._id == chat?._id
                      ? "white"
                      : "black"
                  }
                  px={3}
                  py={2}
                  borderRadius="lg"
                >
                  <PerfectScrollbar>
                    <Box display="flex" justifyContent="space-between">
                      <p className="imgCustom">{chat.question[0]}</p>
                      {index !== 0 ? (
                        <IsolatedModal user={user}></IsolatedModal>
                      ) : (
                        <></>
                      )}
                    </Box>
                  </PerfectScrollbar>
                </Box>
              ))}
            </Stack>
          ) : (
            <>123</>
          )}
        </PerfectScrollbar>
      </Box>
    </Box>
  );
};

export default MyChats;
