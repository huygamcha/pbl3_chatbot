import axios from "axios";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./LogIn.css";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";

function Forgot() {
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const toast = useToast();
  const history = useHistory();

  // show and hide password

  const submitHandler = async (values) => {
    console.log("««««« values »»»»»", values);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "https://pbl3-chatbot.onrender.com/api/forgotPassword",
        {
          email: values.email,
        },
        config
      );

      toast({
        title: "Send successfully and check your email",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setEmail("");
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
          email: "",
          show: true,
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address")
            .required("Email Address is required")
            .matches(
              /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
              "Invalid email address"
            ),
        })}
        onSubmit={submitHandler}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form style={{ width: "100%" }}>
            <Box className="box-error">
              <div>
                <Box display="flex" alignItems="center">
                  <label className="title" htmlFor="email">
                    Email Address
                  </label>
                  <IoMdStar fontSize="10px" color="red"></IoMdStar>
                </Box>

                <Field
                  placeholder="Enter your email"
                  name="email"
                  type="email"
                />
              </div>
              <ErrorMessage name="email">
                {(msg) => (
                  <div className="message-error" style={{ color: "red" }}>
                    {msg}
                  </div>
                )}
              </ErrorMessage>
            </Box>

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </VStack>
  );
}

export default Forgot;
