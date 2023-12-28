import { ChatState } from "../../Context/ChatProvider";
import React from "react";
import { Box } from "@chakra-ui/layout";
import MyChats from "../../components/MyChats";
import Chatbox from "../../components/Chatbox";
import SideDrawer from "../../components/miscellaneous/SideDrawer";
import Navigation from "../../components/Admin/Navigation";

function ChatPage() {
  const user = JSON.parse(localStorage.getItem("userInfo")!);
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
        {user.isAdmin ? (
          <Navigation></Navigation>
        ) : (
          <>
            <MyChats /> <Chatbox />
          </>
        )}
      </Box>
    </div>
  );
}

export default ChatPage;
