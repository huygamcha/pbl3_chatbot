import { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Box } from "@chakra-ui/react";
import "./LogIn.css";
import { IoMdStar } from "react-icons/io";

function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [pic, setPic] = useState();
  const [showConfirm, setShowConfirm] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  // hide and show password
  const handleClick = () => {
    setShow(!show);
  };

  // hide and show password
  const handleClickconfirm = () => {
    setShowConfirm(!showConfirm);
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
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
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
          console.log(data.url.toString());
          setPicLoading(false);
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
    console.log("««««« pic »»»»»", pic);
  };

  const submitHandler = async (values) => {
    // setPicLoading(true);
    console.log("««««« values »»»»»", values);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "https://pbl3-chatbot.onrender.com/api/user",
        {
          name: values.name,
          email: values.email,
          password: values.password,
          pic,
        },
        config
      );
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/chats");
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
  return (
    <VStack>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .required("Name is required")
            .matches(
              /^[a-zA-Z\s]*$/,
              "Name must only contain letters and spaces"
            )
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name must be at most 50 characters"),
          email: Yup.string()
            .email("Invalid email address")
            .required("Email is required")
            .matches(
              /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
              "Invalid email address"
            ),
          password: Yup.string()
            .min(3, "Password must be 3 characters long")
            .required("Password is required"),
          passwordConfirm: Yup.string().oneOf(
            [Yup.ref("password")],
            "Password must match"
          ),
        })}
        onSubmit={submitHandler}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form style={{ width: "100%" }}>
            <Box className="box-error">
              <div>
                <Box display="flex" alignItems="center">
                  <label htmlFor="name">Your name</label>
                  <IoMdStar color="red"></IoMdStar>
                </Box>
                <Field placeholder="Enter your name" name="name" type="text" />
              </div>
              <ErrorMessage name="name">
                {(msg) => <div className="message-error">{msg}</div>}
              </ErrorMessage>
            </Box>

            <Box className="box-error">
              <div>
                <label htmlFor="email">Email Address</label>
                <Field
                  placeholder="Enter your email"
                  name="email"
                  type="email"
                />
              </div>
              <ErrorMessage name="email">
                {(msg) => <div className="message-error">{msg}</div>}
              </ErrorMessage>
            </Box>

            <Box className="box-error">
              <label htmlFor="password">Password</label>
              <Field
                placeholder="Enter your password"
                name="password"
                type={"password"}
              />
              <ErrorMessage name="password">
                {(msg) => <div className="message-error">{msg}</div>}
              </ErrorMessage>
            </Box>

            <Box className="box-error">
              <label htmlFor="passwordConfirm">Confirm Password</label>
              <Field
                placeholder="Confirm your password"
                name="passwordConfirm"
                type={"password"}
              />
              <ErrorMessage name="passwordConfirm">
                {(msg) => <div className="message-error">{msg}</div>}
              </ErrorMessage>
            </Box>

            <Box className="box-error">
              <label htmlFor="avatar">Select Avatar</label>
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
            </Box>
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </VStack>
  );
}

export default Signup;
