import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

interface ChatProviderProps {
  children: React.ReactNode;
}

export interface ChatContextProps {
  selectedChat: any;
  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
  selectedChatHistory: any;
  setSelectedChatHistory: React.Dispatch<React.SetStateAction<any>>;
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

// định nghĩa một chatContext
export const ChatContext = createContext<ChatContextProps | undefined>(
  undefined
);

// dùng để truyền các giá trị cho cho các component con
const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState<boolean>();
  const [selectedChatHistory, setSelectedChatHistory] = useState<boolean>();
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

    if (location.pathname == "/reset-password") {
      // history.push("/reset-password");
    } else if (!userInfo) history.push("/");
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        selectedChatHistory,
        setSelectedChatHistory,
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

// sử dụng với chat, custom hook giúp lấy được các value thuận tiện hơn cho các component con
export const ChatState = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatState must be used within a ChatProvider");
  }
  return context;
};

export default ChatProvider;
