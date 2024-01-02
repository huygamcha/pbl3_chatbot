import { AddIcon, CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";

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
const Navigation = () => {
  const { selectedChat, setSelectedChat, newChat, setChatId, setNewChat } =
    ChatState();
  const [adminSelected, setAdminSelected] = useState("");
  const user = JSON.parse(localStorage.getItem("userInfo")!);
  interface Chat {
    _id: string;
    // Thêm các thuộc tính khác của chat
    question: string[];
    // Các thuộc tính khác nếu có
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
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUserId, setSelectedUserId] = useState(null);

  const toast = useToast();

  //   const { isOpen, onOpen, onClose } = useDisclosure();
  //   const handleConfirm = () => {
  //     console.log("Confirmed!");
  //     onClose();
  //   };
  //   return (
  //     <Box as="section">
  //       <Button onClick={onOpen} size="sm">
  //         {course.courseTitle}
  //       </Button>
  //       <Modal isOpen={isOpen} onClose={onClose}>
  //         <ModalOverlay />
  //         <ModalContent>
  //           <ModalHeader>{course.courseTitle}</ModalHeader>
  //           <ModalCloseButton />
  //           <ModalBody>{course.name}</ModalBody>

  //           <ModalFooter>
  //             <Button colorScheme="blue" mr={3} onClick={handleConfirm}>
  //               Close
  //             </Button>
  //             <Button colorScheme="blue" mr={3} onClick={onClose}>
  //               Ok
  //             </Button>
  //           </ModalFooter>
  //         </ModalContent>
  //       </Modal>
  //     </Box>
  //   );
  // };

  // const handleClick = (chat) => {
  //   setSelectedChat(chat);
  //   setChatId(chat._id); // Lưu ID của chat (nếu cần)
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const userId = user._id;
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };
  //     const apiUrl = `https://pbl3-chatbot.onrender.com/api/history/get?id=${userId}`;
  //     try {
  //       const response = await axios.get(apiUrl, config);
  //       const allHistory = response.data;
  //       allHistory.unshift({ question: ["New chat", "new chat"], _id: "123" });
  //       setValue(allHistory);
  //       // Xử lý dữ liệu ở đây
  //     } catch (error) {
  //       console.error("Error fetching history:", error.message);
  //     }
  //   };

  //   fetchData(); // Gọi hàm fetchData ngay sau khi định nghĩa nó
  // }, []);

  // reload lại trang khi có một đoạn chat mới ( chưa thử trên mô hình)
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const userId = user._id;
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };
  //     const apiUrl = `https://pbl3-chatbot.onrender.com/api/history/get?id=${userId}`;
  //     try {
  //       const response = await axios.get(apiUrl, config);
  //       const allHistory = response.data;
  //       allHistory.unshift({ question: ["New chat", "new chat"], _id: "123" });
  //       setValue(allHistory);
  //       // Xử lý dữ liệu ở đây
  //     } catch (error) {
  //       console.error("Error fetching history:", error.message);
  //     }
  //   };

  //   fetchData(); // Gọi hàm fetchData ngay sau khi định nghĩa nó
  // }, [newChat]);

  // const handleDelete = async () => {
  //   console.log("«««««123  »»»»»", selectedChat._id);
  //   if (selectedChat._id != 123) {
  //     const deleteUrl = `https://pbl3-chatbot.onrender.com/api/history/delete?id=${selectedChat._id}`;
  //     if (window.confirm("Do you want to delete this chat?"))
  //       try {
  //         // Gửi yêu cầu DELETE bằng Axios

  //         const response = await axios.delete(deleteUrl);
  //         // Kiểm tra trạng thái phản hồi (response status)
  //         if (response.status === 200) {
  //           setNewChat("123");
  //           console.log("Xóa thành công!", response.data);
  //         } else {
  //           console.error(
  //             "Lỗi khi xóa. Trạng thái phản hồi không hợp lệ:",
  //             response.status
  //           );
  //         }
  //       } catch (error) {
  //         // Xử lý lỗi
  //         console.error("Lỗi khi gửi yêu cầu DELETE:", error.message);
  //       }
  //   }
  // };
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
              <Box
                my={5}
                w="10%"
                p={4}
                borderRadius="10px"
                // boxShadow=" 1px 1px 20px 5px #c5c5c5"
                bg="#e8e8e8"
              >
                Top chat
              </Box>
              <Box
                mt={0}
                display="flex"
                justifyContent="space-between"
                alignItems="end"
              >
                <Box
                  boxShadow=" 1px 1px 20px 5px #c5c5c5"
                  bg="#e8e8e8"
                  p="10"
                  width="30%"
                  borderRadius="10px"
                  height="100px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text display="flex" mb={2} textTransform="uppercase">
                    Top 3:
                  </Text>
                  <Text fontWeight="bold">
                    {allChat ? allChat[2].user?.name : "N/A"} (
                    {allChat ? allChat[2].totalQuestions : "N/A"})
                  </Text>
                </Box>

                <Box
                  boxShadow=" 1px 1px 20px 5px #c5c5c5"
                  bg="#e8e8e8"
                  p="10"
                  width="30%"
                  borderRadius="10px"
                  height="200px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text display="flex" mb={2} textTransform="uppercase">
                    Top 1:
                  </Text>
                  <Text fontWeight="bold">
                    {allChat ? allChat[0].user?.name : "N/A"} (
                    {allChat ? allChat[0].totalQuestions : "N/A"})
                  </Text>
                </Box>
                <Box
                  boxShadow=" 1px 1px 20px 5px #c5c5c5"
                  bg="#e8e8e8"
                  p="10"
                  width="30%"
                  borderRadius="10px"
                  height="150px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text display="flex" mb={2} textTransform="uppercase">
                    Top 2:
                  </Text>
                  <Text fontWeight="bold">
                    {allChat ? allChat[1].user?.name : "N/A"} (
                    {allChat ? allChat[1].totalQuestions : "N/A"})
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
                    <Th>admin</Th>
                    <Th>avatar</Th>
                    <Th>action</Th>
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
                      <Td>
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
                      <Td>
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
