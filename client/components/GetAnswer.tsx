import axios from "axios";

const GetAnswer = async (query) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_URL_ANSWER}/${query}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const jsonResponse = response.data.result;

      return jsonResponse; // hoặc giá trị cần trả về khác
    }
  } catch (error) {
    console.error("Error making HTTP request:", error.message);
    throw error; // Ném lỗi để xử lý nó ở nơi khác nếu cần
  }
};

export default GetAnswer;
