import React from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import Reset from "../../components/authentication/Reset";

function ForgetPassword() {
  return (
    <Container maxW="xl" centerContent>
      <Box
        bg="white"
        display="block"
        justifyContent="center"
        p={3}
        width="100%"
        borderRadius="10px"
        margin="10px 0px 0px"
      >
        <Text fontSize="30px" textAlign="center">
          Set new password
        </Text>
      </Box>
      <Box
        bg="white"
        display="block"
        justifyContent="center"
        p={3}
        width="100%"
        borderRadius="10px"
        margin="10px 0px 0px"
      >
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList>{/* <Tab>Sign in</Tab> */}</TabList>
          <TabPanels>
            <TabPanel>
              <Reset></Reset>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default ForgetPassword;
