import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

interface ChatProviderProps {
  children: React.ReactNode;
}

export interface ChatContextProps {
  selectedChat: any;
  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
  newChat: any;
  setNewChat: React.Dispatch<React.SetStateAction<any>>;
  user: any;
  currentUser: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  chatId: any[];
  setChatId: React.Dispatch<React.SetStateAction<any[]>>;
  chats: any;
  setChats: React.Dispatch<React.SetStateAction<any>>;
}

export const ChatContext = createContext<ChatContextProps | undefined>(
  undefined
);

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState<boolean>();
  const [user, setUser] = useState<any>();
  const [chatId, setChatId] = useState<any[]>([]);
  const [chats, setChats] = useState<any>();
  const [newChat, setNewChat] = useState<String[]>();
  let currentUser;

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")!);

    // Lưu giá trị user vào biến thường
    currentUser = userInfo;

    // Ngay lập tức sử dụng giá trị user trong các component khác
    // không cần chờ setState

    setUser(currentUser);

    if (!userInfo) history.push("/");
    console.log("««««« history »»»»»", location.pathname);
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        newChat,
        setNewChat,
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        chatId,
        setChatId,
        chats,
        setChats,
        currentUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatState must be used within a ChatProvider");
  }
  return context;
};

export default ChatProvider;
