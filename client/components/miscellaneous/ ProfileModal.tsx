import { ViewIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Image,
  Input,
  Box,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import axios from "axios";
import IsolatedModal from "../ConfirmDialog";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const toast = useToast();
  const [picLoading, setPicLoading] = useState(false);
  const [pic, setPic] = useState();
  const userAdmin = JSON.parse(localStorage.getItem("userInfo")!);
  const [admin, setAdmin] = useState(true);

  const handleShowPassword = () => {
    setShow(!show);
  };

  const handleShowCPassword = () => {
    setShowConfirm(!showConfirm);
  };

  useEffect(() => {
    setName(user.name);
    setPic(user.pic);
  }, [user]);

  useEffect(() => {
    setAdmin(false);
    if (user.isAdmin) {
      setAdmin(true);
    }
  }, [isOpen, onOpen, onClose]);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  let isError = true;
  let isName = false;

  const handleUpdate = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "Password does not match",
        status: "success",
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
          // Authorization: `Bearer ${user.token}`,
        },
      };
      if (!userAdmin.isAdmin) {
        const { data } = await axios.patch(
          `https://pbl3-chatbot.onrender.com/api/user?id=${user._id}`,
          {
            name,
            password,
            pic,
          },
          config
        );
      } else {
        const { data } = await axios.patch(
          `https://pbl3-chatbot.onrender.com/api/user/updateUserByAdmin?id=${user._id}`,
          {
            name,
            password,
            pic,
            admin,
          },
          config
        );
      }

      toast({
        title: "Updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      onClose();
      setPicLoading(false);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  // handle save image to server
  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "pbl3_chatbot");
      data.append("cloud_name", "drqphlfn6");
      fetch("https://api.cloudinary.com/v1_1/drqphlfn6/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          // console.log(data.url.toString());
          setPicLoading(false);
          user.pic = data.url.toString();
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  if (password === confirmPassword) {
    isError = false;
  }

  if (name == "") {
    isName = true;
  }

  //admin

  const handleAdmin = () => {
    setAdmin(!admin);
  };

  console.log("««««« userAdmin »»»»»", admin);
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
          aria-label={""}
        />
      )}
      <Modal size="xl" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />

        <ModalContent h="80%">
          <ModalHeader
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            It's your profile
          </ModalHeader>
          <ModalBody>
            <Box display="flex">
              <Box>
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  src={user.pic}
                  alt={user.name}
                  mr={2}
                />
                <FormControl id="pic">
                  <FormLabel>Upload your Picture</FormLabel>
                  <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => {
                      const selectedFile = e.target.files && e.target.files[0];
                      if (selectedFile) {
                        postDetails(selectedFile);
                      }
                    }}
                  />
                </FormControl>
                {userAdmin.isAdmin ? (
                  <Box mt={4} fontWeight="bold">
                    <Checkbox
                      // hiển thị khi là admin
                      disabled={!user.isAdmin && !userAdmin.isAdmin}
                      // hiển thị check nếu là admin
                      defaultChecked={admin && user.isAdmin}
                      onChange={handleAdmin}
                    >
                      Admin
                    </Checkbox>
                  </Box>
                ) : (
                  <Box mt={2}></Box>
                )}
              </Box>

              <Box w="100%" ml={2}>
                <FormControl isDisabled id="email" pb={5}>
                  <FormLabel>Email</FormLabel>
                  <Input p={2} value={user.email}></Input>
                </FormControl>

                <FormControl id="name" pb={5} isInvalid={isName}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    p={2}
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  ></Input>
                  <FormErrorMessage>
                    Name cannot be left blank.
                  </FormErrorMessage>
                </FormControl>

                <FormControl id="password" pb={5}>
                  <FormLabel>New password</FormLabel>
                  <InputGroup>
                    <Input
                      p={2}
                      pr="4.5rem"
                      type={show ? "text" : "password"}
                      placeholder="Enter password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleShowPassword}
                      >
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl id="password" pb={5} isInvalid={isError}>
                  <FormLabel>Confirm password</FormLabel>
                  <InputGroup>
                    <Input
                      p={2}
                      pr="4.5rem"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleShowCPassword}
                      >
                        {showConfirm ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>Password does not match.</FormErrorMessage>
                </FormControl>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="space-between">
            <Button
              colorScheme="blue"
              onClick={() => {
                handleUpdate();
              }}
            >
              Update
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
