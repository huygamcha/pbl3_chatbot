import { ChatState } from "../../Context/ChatProvider";
import React from "react";
import { Box } from "@chakra-ui/layout";
import MyChats from "../../components/MyChats";
import Chatbox from "../../components/Chatbox";
import SideDrawer from "../../components/miscellaneous/SideDrawer";

function ChatPage() {
  return (
    <div style={{ width: "100%" }}>
      <SideDrawer></SideDrawer>

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        <MyChats />
        <Chatbox />
      </Box>
    </div>
  );
}

export default ChatPage;
