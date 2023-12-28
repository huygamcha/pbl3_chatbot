import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { clsx } from "clsx";
// import { styles } from "";
const Navigation = () => {
  const { selectedChat, setSelectedChat, newChat, setChatId, setNewChat } =
    ChatState();
  const [adminSelected, setAdminSelected] = useState("dashboard");
  const user = JSON.parse(localStorage.getItem("userInfo")!);
  interface Chat {
    _id: string;
    // Thêm các thuộc tính khác của chat
    question: string[];
    // Các thuộc tính khác nếu có
  }

  interface User {
    name: String;
  }

  interface allChat {
    totalQuestions: number;
    user: User;
  }

  interface allUser {
    name: string;
  }

  interface allNewUser {
    total: number;
    data: User;
  }
  const [allUser, setAllUser] = useState<allUser[] | undefined>();
  const [allChat, setAllChat] = useState<allChat[] | undefined>();
  const [allNewUser, setAllNewUser] = useState<allNewUser | undefined>();
  const [value, setValue] = useState<Chat[]>([]);
  const [allChats, setAllChats] = useState<number>(0);

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
  useEffect(() => {
    const getAllUser = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const apiUrl = `http://localhost:2001/api/user/getAll`;
      try {
        const response = await axios.get(apiUrl, config);
        // Xử lý dữ liệu ở đây
        setAllUser(response.data.payload);
      } catch (error) {
        console.error("Error fetching history:", error.message);
      }
    };

    const getAllChat = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const apiUrl = `http://localhost:2001/api/history/getAll`;
      try {
        const response = await axios.get(apiUrl, config);
        // Xử lý dữ liệu ở đây
        setAllChat(response.data.payload);
      } catch (error) {
        console.error("Error fetching history:", error.message);
      }
    };

    const getAllNewUser = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const apiUrl = `http://localhost:2001/api/user/newUser`;
      try {
        const response = await axios.get(apiUrl, config);
        // Xử lý dữ liệu ở đây
        setAllNewUser(response.data.payload);
      } catch (error) {
        console.error("Error fetching history:", error.message);
      }
    };

    getAllUser(); // Gọi hàm fetchData ngay sau khi định nghĩa nó
    getAllChat();
    getAllNewUser();
  }, []);

  useEffect(() => {
    // let newChats = allChat?.map((value) => (newChats += value?.totalQuestions));
    // setAllChats(newChats);
    allChat?.map((value) => {
      setAllChats((prev) => value?.totalQuestions + prev);
    });
  }, [allChat]);

  console.log("«« ««« response »»»»»", allUser);
  console.log("««««« allChat »»»»»", allChat ? allChat : "N/A");

  console.log("««««« selectedChat »»»»»", selectedChat);
  console.log("««««« adminSelected »»»»»", adminSelected);
  console.log("««««« allChats »»»»»", allChats);
  console.log("««««« allNewUser »»»»»", allNewUser?.data, allNewUser?.total);
  return (
    <>
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
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          Overview
        </Box>
        <Box
          onClick={() => setAdminSelected("dashboard")}
          cursor="pointer"
          bg="#e8e8e8"
          _hover={{ background: "#38b2ac", color: "white" }}
          width="100%"
          display="flex"
          alignItems="center"
          color="black"
          px={3}
          py={2}
          mb={2}
          borderRadius="lg"
          overflow="hidden"
        >
          <Box overflow="hidden">
            <Text>Dashboard</Text>
          </Box>
        </Box>
        <Box
          onClick={() => setAdminSelected("users")}
          cursor="pointer"
          bg="#e8e8e8"
          _hover={{ background: "#38b2ac", color: "white" }}
          width="100%"
          display="flex"
          alignItems="center"
          color="black"
          px={3}
          py={2}
          mb={2}
          borderRadius="lg"
          overflow="hidden"
        >
          <Box overflow="hidden">
            <Text>Users</Text>
          </Box>
        </Box>
      </Box>

      {/* screen */}
      <Box width="80%" display="flex" flexDir="column" h="100%">
        <Box
          overflowY="auto"
          alignItems="center"
          flex="9"
          p={3}
          bg="white"
          borderTopRadius="lg"
          borderWidth="1px"
          position="relative"
        >
          {/* {} */}
          {adminSelected == "dashboard" ? (
            <Box display="flex" justifyContent="space-around">
              <Box
                // boxShadow=" 0px 14px 28px "
                bg="#e8e8e8"
                p="10"
                width="30%"
                borderRadius="10px"
              >
                <Text display="flex" mb={2} textTransform="uppercase">
                  Total user:
                  <Text ml={2} textTransform="uppercase" fontWeight="bold">
                    {allUser ? allUser.length : "N/A"}
                  </Text>
                </Text>
              </Box>
              <Box bg="#e8e8e8" p="10" width="30%" borderRadius="10px">
                <Text display="flex" mb={2} textTransform="uppercase">
                  Total chat:
                  <Text ml={2} textTransform="uppercase" fontWeight="bold">
                    {allChats ? allChats : <></>}
                  </Text>
                </Text>
              </Box>
              <Box bg="#e8e8e8" p="10" width="30%" borderRadius="10px">
                <Text display="flex" mb={2} textTransform="uppercase">
                  most active users:
                </Text>
                <Text textTransform="uppercase" fontWeight="bold">
                  {allChat ? allChat[0]?.user.name : <></>}
                </Text>
              </Box>
            </Box>
          ) : allUser ? (
            allUser[0]?.name
          ) : (
            "N/A"
          )}
        </Box>
      </Box>
    </>
  );
};

export default Navigation;
