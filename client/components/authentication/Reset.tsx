import { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { FormErrorMessage, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import React from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function Reset() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const toast = useToast();
  const handleShowPassword = () => {
    setShow(!show);
  };
  let isError = true;
  const history = useHistory();
  // show and hide password
  const handleClick = () => {
    setShow(!show);
  };
  let isLength = false;
  if (password.length == 1 || password.length == 2) {
    isLength = true;
  } else if (password.length >= 3) {
    isLength = false;
  }
  if (password === confirmPassword) {
    isError = false;
  }

  const handleClickConfirm = () => {
    setShowConfirm(!showConfirm);
  };
  const token = location.search.slice(7);
  console.log("««««« token »»»»»", token);

  const submitHandler = async () => {
    if (!confirmPassword || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `https://pbl3-chatbot.onrender.com/api/resetPassword?token=${token}`,
        {
          password,
        },
        config
      );

      toast({
        title: "Change password Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      history.push("/");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <VStack>
      <FormControl id="password" pb={5} isInvalid={isLength}>
        <FormLabel>New password</FormLabel>
        <InputGroup className="box-error-profile">
          <Input
            padding="8px"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              p={0}
              className="show-password-profile"
              h="1.75rem"
              size="sm"
              onClick={handleShowPassword}
            >
              {show ? <FaRegEye /> : <FaRegEyeSlash />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>Password at least 3 characters.</FormErrorMessage>
      </FormControl>

      <FormControl id="password" pb={5} isInvalid={isError}>
        <FormLabel>Confirm password</FormLabel>
        <InputGroup>
          <Input
            // padding={{ base: "8px", md: "8px" }}
            padding="8px"
            // pr="4.5rem"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </InputGroup>
        <FormErrorMessage>Password does not match.</FormErrorMessage>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Change password
      </Button>
    </VStack>
  );
}

export default Reset;
