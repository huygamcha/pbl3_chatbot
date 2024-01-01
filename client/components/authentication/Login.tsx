import { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./LogIn.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [show, setShow] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClick = async (values, setFieldValue) => {
    // Thực hiện logic khi nút được nhấp
    await setFieldValue("email", "guest@example.com");
    await setFieldValue("password", "123456");
  };

  const submitHandler = async (values, { setSubmitting }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "https://pbl3-chatbot.onrender.com/api/user/login",
        {
          email: values.email,
          password: values.password,
        },
        config
      );
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
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
    }
  };

  return (
    <VStack>
      <Formik
        initialValues={{
          email: email,
          password: password,
          show: false,
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address")
            .required("Email Address is required")
            .matches(
              /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
              "Invalid email address"
            ),
          password: Yup.string()
            .min(3, "Password must be 3 characters long")
            .required("Password is required"),
        })}
        onSubmit={submitHandler}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form style={{ width: "100%" }}>
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
                {(msg) => (
                  <div className="message-error" style={{ color: "red" }}>
                    {msg}
                  </div>
                )}
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
                {(msg) => (
                  <div className="message-error" style={{ color: "red" }}>
                    {msg}
                  </div>
                )}
              </ErrorMessage>
            </Box>
            <button type="submit">Submit</button>
            <button
              type="button"
              style={{ backgroundColor: "red" }}
              onClick={() => handleClick(values, setFieldValue)}
            >
              Get Guest User Credentials
            </button>
          </Form>
        )}
      </Formik>
    </VStack>
  );
}

export default Login;
