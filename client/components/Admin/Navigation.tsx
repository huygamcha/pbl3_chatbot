import { AddIcon, CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import io from "socket.io-client";

import {
  Avatar,
  Button,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { clsx } from "clsx";
import ConfirmDialog from "../ConfirmDialog";
import IsolatedModal from "../ConfirmDialog";
import ProfileModal from "../miscellaneous/ ProfileModal";
// import { styles } from "";
var socket;

const Navigation = () => {
  const { selectedChat, setSelectedChat, newChat, setChatId, setNewChat } =
    ChatState();
  const [adminSelected, setAdminSelected] = useState("");
  const user = JSON.parse(localStorage.getItem("userInfo")!);

  interface Chat {
    _id: string;
    question: string[];
  }

  interface User {
    name: String;
    totalQuestions: number;
  }

  interface allChat {
    totalQuestions: number;
    user: User;
  }

  interface allUser {
    name: string;
    email: String;
    isAdmin: boolean;
    pic: string;
    isOnline: boolean;
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

  const [selectedUserId, setSelectedUserId] = useState(null);

  const toast = useToast();
  const ENDPOINT = "https://pbl3-chatbot.onrender.com";

  //socket
  useEffect(() => {
    // socket = io(ENDPOINT);
    socket.on("allLogins", (data) => {
      console.log("««««« allLogins »»»»»", data);
    });
  }, []);

  useEffect(() => {
    const getAllUser = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const apiUrl = `https://pbl3-chatbot.onrender.com/api/user/getAll`;
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
      const apiUrl = `https://pbl3-chatbot.onrender.com/api/history/getAll`;
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
      const apiUrl = `https://pbl3-chatbot.onrender.com/api/user/newUser`;
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
            <Box display="flex" flexDirection="column">
              <Box
                my={5}
                w="10%"
                p={4}
                borderRadius="10px"
                // boxShadow=" 1px 1px 20px 5px #c5c5c5"
                bg="#e8e8e8"
              >
                Data
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Box
                  boxShadow=" 1px 1px 20px 5px #c5c5c5"
                  bg="#e8e8e8"
                  p="10"
                  width="23%"
                  borderRadius="10px"
                >
                  <Text display="flex" mb={2} textTransform="uppercase">
                    Total user:
                    <Text ml={2} textTransform="uppercase" fontWeight="bold">
                      {allUser ? allUser.length : "N/A"}
                    </Text>
                  </Text>
                </Box>

                <Box
                  boxShadow=" 1px 1px 20px 5px #c5c5c5"
                  bg="#e8e8e8"
                  p="10"
                  width="23%"
                  borderRadius="10px"
                >
                  <Text display="flex" mb={2} textTransform="uppercase">
                    New user today:
                    <Text ml={2} textTransform="uppercase" fontWeight="bold">
                      {allNewUser ? allNewUser?.total : <></>}
                    </Text>
                  </Text>
                </Box>
                <Box
                  boxShadow=" 1px 1px 20px 5px #c5c5c5"
                  bg="#e8e8e8"
                  p="10"
                  width="23%"
                  borderRadius="10px"
                >
                  <Text display="flex" mb={2} textTransform="uppercase">
                    Total chat:
                    <Text ml={2} textTransform="uppercase" fontWeight="bold">
                      {allChats ? allChats : <></>}
                    </Text>
                  </Text>
                </Box>

                <Box
                  boxShadow=" 1px 1px 20px 5px #c5c5c5"
                  bg="#e8e8e8"
                  p="10"
                  width="23%"
                  borderRadius="10px"
                >
                  <Text display="flex" mb={2} textTransform="uppercase">
                    Chat / user:
                    <Text ml={2} textTransform="uppercase" fontWeight="bold">
                      {allChats && allUser ? (
                        (allChats / allUser.length).toFixed(2)
                      ) : (
                        <></>
                      )}
                    </Text>
                  </Text>
                </Box>
              </Box>
            </Box>
          ) : allUser ? (
            <TableContainer>
              <Table variant="striped" colorScheme="teal">
                <TableCaption>
                  {/* Imperial to metric conversion factors */}
                </TableCaption>
                <Thead>
                  <Tr>
                    <Th>STT</Th>
                    <Th>Name</Th>
                    <Th>email</Th>
                    <Th textAlign="center">status</Th>
                    <Th textAlign="center">admin</Th>
                    <Th textAlign="center">avatar</Th>
                    <Th textAlign="center">action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {allUser.map((user, idx) => (
                    <Tr>
                      <Td
                        borderTopLeftRadius="10px"
                        borderBottomLeftRadius="10px"
                      >
                        {idx + 1}
                      </Td>
                      <Td>{user.name}</Td>
                      <Td>{user.email}</Td>
                      <Td textAlign="center">
                        {user.isOnline ? (
                          <CheckIcon
                            bg="#309a49"
                            p={0}
                            fontSize="15px"
                            borderRadius="50%"
                            color="#309a49"
                          ></CheckIcon>
                        ) : (
                          <CheckIcon
                            bg="red"
                            p={0}
                            fontSize="15px"
                            borderRadius="50%"
                            color="red"
                          ></CheckIcon>
                        )}
                      </Td>

                      <Td textAlign="center">
                        {user.isAdmin ? (
                          <CheckIcon
                            bg="teal"
                            p={1}
                            fontSize="30px"
                            borderRadius="50%"
                            color="white"
                          ></CheckIcon>
                        ) : (
                          ""
                        )}
                      </Td>

                      <Td textAlign="center">
                        <Avatar
                          size="sm"
                          cursor="pointer"
                          name={user.name}
                          src={user.pic}
                        ></Avatar>
                      </Td>
                      <Td
                        borderTopRightRadius="10px"
                        borderBottomRightRadius="10px"
                      >
                        <Box alignItems="center" display="flex" fontSize="28px">
                          {/* edit */}
                          <ProfileModal user={user}>
                            <TbEdit cursor="pointer" color="#f2951d" />
                          </ProfileModal>
                          <IsolatedModal key={idx} user={user}></IsolatedModal>
                        </Box>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            "N/A"
          )}
        </Box>
      </Box>
    </>
  );
};

export default Navigation;
