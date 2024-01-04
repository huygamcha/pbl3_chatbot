import { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { Box, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";
import * as Yup from "yup";

function Reset() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const toast = useToast();
  const history = useHistory();
  // show and hide password
  const handleClick = () => {
    setShow(!show);
  };

  const handleClickConfirm = () => {
    setShowConfirm(!showConfirm);
  };
  const handlePassword = async (values, setFieldValue) => {
    await setFieldValue("show", !values.show);
  };

  const submitHandler = async (values) => {
    const token = location.search.slice(7);
    console.log("««««« token »»»»»", token);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `https://pbl3-chatbot.onrender.com/api/resetPassword?token=${token}`,
        {
          password: values.password,
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
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          show: true,
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
              <InputGroup display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                  <label className="title" htmlFor="password">
                    Password
                  </label>
                  <IoMdStar fontSize="10px" color="red"></IoMdStar>
                </Box>

                <Box>
                  <Field
                    placeholder="Enter your password"
                    name="password"
                    type={values.show ? "password" : "text"}
                  />
                  <InputRightElement>
                    <Button
                      padding="0"
                      onClick={() => handlePassword(values, setFieldValue)}
                      backgroundColor="transparent"
                      className="show-password"
                      size="sm"
                    >
                      {values.show ? <FaRegEye /> : <FaRegEyeSlash />}
                    </Button>
                  </InputRightElement>
                </Box>
                {/* <InputRightElement></InputRightElement> */}
                <ErrorMessage name="password">
                  {(msg) => (
                    <div className="message-error" style={{ color: "red" }}>
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </InputGroup>
            </Box>

            <Box className="box-error">
              <Box display="flex" alignItems="center">
                <label className="title" htmlFor="passwordConfirm">
                  Confirm Password
                </label>
                <IoMdStar fontSize="10px" color="red"></IoMdStar>
              </Box>

              <Field
                placeholder="Confirm your password"
                name="passwordConfirm"
                type={"password"}
              />
              <ErrorMessage name="passwordConfirm">
                {(msg) => <div className="message-error">{msg}</div>}
              </ErrorMessage>
            </Box>

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </VStack>
  );
}

export default Reset;
