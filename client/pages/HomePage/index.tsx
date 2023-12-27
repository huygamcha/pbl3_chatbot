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
import Login from "../../components/authentication/Login";
import Signup from "../../components/authentication/Signup";
import Forgot from "../../components/authentication/Forget";

function HomePage() {
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
          Home
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
          <TabList>
            <Tab>Sign in</Tab>
            <Tab>Sign up</Tab>
            <Tab>Forgot password</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login></Login>
            </TabPanel>
            <TabPanel>
              <Signup></Signup>
            </TabPanel>
            <TabPanel>
              <Forgot></Forgot>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;
