import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import React from "react";
import io from "socket.io-client";
var socket;
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
// import ProfileModal from "./ProfileModal";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { Spinner } from "@chakra-ui/spinner";
import { ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModal from "./ ProfileModal";
import ChatLoading from "../userAvatar/ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import Dashboard from "../Admin/Dashboard";

function SideDrawer() {
  const [search, setSearch] = useState("");
  interface UserType {
    _id: string;
  }
  interface SearchResult {
    users: UserType[]; // Chắc chắn rằng UserType chứa tất cả các thuộc tính bạn sử dụng
    // Các thuộc tính khác nếu có
  }
  const [searchResult, setSearchResult] = useState<SearchResult>({ users: [] }); // Sử dụng type SearchResult ở đây
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("userInfo")!);
  const ENDPOINT = "https://pbl3-chatbot.onrender.com";

  const logoutHandler = async () => {
    socket = io(ENDPOINT);
    socket.emit("logout", user);

    localStorage.removeItem("userInfo");
    // loại bỏ đoạn chat cũ
    localStorage.removeItem("chat");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.patch(
        `https://pbl3-chatbot.onrender.com/api/user?id=${user._id}`,
        {
          isOnline: false,
          dateOnline: new Date(),
        }
      );
    } catch (error) {
      console.log("««««« error »»»»»", error);
    }
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://pbl3-chatbot.onrender.com/api/user?keyword=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        {user.isAdmin ? (
          <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={onOpen}>
              <i className="fas fa-search"></i>
              <Text display={{ base: "none", md: "flex" }} px={4}>
                Search User
              </Text>
            </Button>
          </Tooltip>
        ) : (
          <Text fontSize="2xl" fontFamily="Work sans">
            {/* Chatbot */}
          </Text>
        )}
        {!user.isAdmin ? (
          <Text
            fontWeight="bold"
            textTransform="uppercase"
            fontSize="2xl"
            fontFamily="Work sans"
          >
            Chatbot
          </Text>
        ) : (
          <Dashboard></Dashboard>
        )}
        <div>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider></MenuDivider>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.users?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  // handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
