import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Box, Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import GetAnswer from "./GetAnswer";
import { useToast } from "@chakra-ui/react";

var socket;

function Chatbox() {
  const ENDPOINT = "http://localhost:2001";
  const [question, setQuestion] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [listQuestion, setListQuestion] = useState<Array<String>[]>([[]]);
  const containerRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLElement | null>(null);
  const [answer, setAnswer] = useState("");
  const [storeQuestion, setStoreQuestion] = useState("");
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("userInfo")!);

  // const [height, setHeight] = useState();
  const { selectedChat, setSelectedChat, setNewChat } = ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
  }, []);

  const handleTyping = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async () => {
    setDisplayText(question);
    setStoreQuestion(question);
    try {
      const response = await axios.post(
        "https://easy-partially-cicada.ngrok-free.app/query_description",
        {
          query: question,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const receivedQueryId = response.data.query_id;
        console.log("««««« receivedQueryId »»»»»", receivedQueryId);
        GetAnswer(receivedQueryId)
          .then((result) => {
            setAnswer(result);
            console.log(result); // In ra kết quả từ promiseResult
          })
          .catch((error) => {
            console.error("Error:", error.message);
          });
        // Call the additional API with the received queryId
        // Gửi kết quả từ API về cho client thông qua WebSocket
      }
    } catch (error) {
      console.error("Error making HTTP request:", error.message);
    }
    setQuestion("");
  };

  // hiển thị khi send (đoạn này chưa lấy được câu trả lời)
  // nên là phần trả lời sẽ set là rỗng
  useEffect(() => {
    // Phần 1: Xử lý khi displayText thay đổi để thêm câu hỏi mới vào danh sách
    if (displayText !== "") {
      setListQuestion((prevList) => {
        const newList: String[][] = Array.isArray(prevList)
          ? [...prevList, [displayText]]
          : [[displayText]];
        return newList;
      });
    }
  }, [displayText]);

  // call history
  useEffect(() => {
    setListQuestion([]);
    if (selectedChat?._id != 123) {
      for (let i = 0; i < selectedChat?.question.length; i++) {
        const tempChat = [selectedChat?.question[i], selectedChat?.answer[i]];
        setListQuestion((prev) => [...prev, tempChat]);
      }
    }
  }, [selectedChat]);

  // auto scroll
  useEffect(() => {
    setDisplayText("");
    if (containerRef.current) {
      (containerRef.current as any).scrollTop = (
        containerRef.current as any
      ).scrollHeight;
    }
  }, [listQuestion]);

  useEffect(() => {
    // Tạo một bản sao của listQuestion để tránh thay đổi trực tiếp state
    const updatedListQuestion = [...listQuestion];
    if (storeQuestion !== "" && answer !== "") {
      const storageHistory = async () => {
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          // nếu chọn new chat, và chưa tồn tại đoạn chat nào hết
          if (!selectedChat || selectedChat._id == 123) {
            const response = await axios.post(
              "http://localhost:2001/api/history/create",
              {
                userId: user._id,
                question: storeQuestion,
                answer: answer,
              },
              config
            );
            setNewChat(response.data);
            setSelectedChat(response.data);
          } else {
            await axios.post(
              `http://localhost:2001/api/history/create?id=${selectedChat._id}`,
              {
                userId: user._id,
                question: storeQuestion,
                answer: answer,
              },
              config
            );
          }
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      };
      storageHistory();
    }

    for (let i = 0; i < updatedListQuestion.length; i++) {
      if (updatedListQuestion[i].length === 1) {
        updatedListQuestion[i].push(answer);
      }
    }

    // Cập nhật state để kích thích việc render lại ở trang này
    setListQuestion(updatedListQuestion);
  }, [answer]);
  console.log("««««« selectedChat123 »»»»»", selectedChat);

  console.log("««««« listQuestion »»»»»", listQuestion);
  console.log("««««« user._id »»»»»", user._id);

  return (
    <Box width="80%" display="flex" flexDir="column" h="100%">
      <Box
        overflowY="auto"
        alignItems="center"
        flex="9"
        p={3}
        bg="white"
        borderTopRadius="lg"
        borderWidth="1px"
        position="relative"
      >
        <PerfectScrollbar containerRef={(ref) => (containerRef.current = ref)}>
          {listQuestion ? (
            listQuestion.map((value, index) => {
              if (value.length == 2) {
                return (
                  <>
                    <Text
                      ref={(ref) => (textRef.current = ref)}
                      bg="#dadada"
                      p={3}
                      borderRadius="lg"
                      m={10}
                    >
                      {value[0]}
                    </Text>
                    <Text
                      ref={(ref) => (textRef.current = ref)}
                      bg="#dadada"
                      p={3}
                      borderRadius="lg"
                      m={10}
                    >
                      {value[1]}
                    </Text>
                  </>
                );
              } else if (value.length == 1) {
                return (
                  <>
                    <Text
                      ref={(ref) => (textRef.current = ref)}
                      bg="#dadada"
                      p={3}
                      borderRadius="lg"
                      m={10}
                    >
                      {value[0]}
                    </Text>
                    <Text
                      color="black"
                      ref={(ref) => (textRef.current = ref)}
                      bg="#dadada"
                      p={3}
                      borderRadius="lg"
                      m={10}
                    >
                      Please waiting for answer
                    </Text>
                  </>
                );
              }
            })
          ) : (
            <></>
          )}
        </PerfectScrollbar>
      </Box>

      <Box
        // mt={1}
        borderBottomRadius="lg"
        borderWidth="1px"
        bg="white"
        p={0}
        // flex="1"
      >
        <Input
          mr={2}
          textColor="black"
          placeholder="Type the question"
          width="89%"
          value={question}
          onChange={handleTyping}
        />
        <Button width="10%" colorScheme="blue" onClick={handleSubmit}>
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default Chatbox;
