import { Avatar } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/layout";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";
const UserListItem = ({ user }) => {
  return (
    <>
      <Box
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
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={user.name}
          src={user.pic}
        />
        <Box overflow="hidden">
          <Text>{user.name}</Text>
          <Text fontSize="xs" overflow="hidden">
            <b>Email:</b>
            {user.email}
          </Text>
        </Box>
      </Box>
    </>
  );
};
export default UserListItem;
