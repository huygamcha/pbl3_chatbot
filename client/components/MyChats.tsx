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
// import { styles } from "";
const MyChats = () => {
  const { selectedChat, setSelectedChat, newChat, setChatId, setNewChat } =
    ChatState();
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

    fetchData(); // Gọi hàm fetchData ngay sau khi định nghĩa nó
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

  const handleDelete = async () => {
    console.log("«««««123  »»»»»", selectedChat._id);
    if (selectedChat._id != 123) {
      const deleteUrl = `https://pbl3-chatbot.onrender.com/api/history/delete?id=${selectedChat._id}`;
      if (window.confirm("Do you want to delete this chat?"))
        try {
          // Gửi yêu cầu DELETE bằng Axios

          const response = await axios.delete(deleteUrl);
          // Kiểm tra trạng thái phản hồi (response status)
          if (response.status === 200) {
            setNewChat("123");
            console.log("Xóa thành công!", response.data);
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
  };

  console.log("««««« selectedChat »»»»»", selectedChat);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
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
        {value ? (
          <Stack>
            {value.map((chat, index) => (
              <Box
                key={index}
                onClick={() => handleClick(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
              >
                <Text>
                  <p className="image">
                    {chat.question[0]}
                    <DeleteIcon
                      onClick={handleDelete}
                      style={{ font: "30px" }}
                    ></DeleteIcon>{" "}
                  </p>
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <>123</>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
