import axios from "axios";


const axiosInstance = axios.create({
  baseURL: "http://localhost:1111",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const get = async (url, config = {}) => {
  try {
    const response = await axiosInstance.get(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const post = async (url, data, config = {}) => {
  try {
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  } catch (error) {
    console.warn(error.response?.data?.message || error.message);
    throw error;
  }
};

const put = async (url, data, config = {}) => {
  try {
    const response = await axiosInstance.put(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const remove = async (url, config = {}) => {
  try {
    const response = await axiosInstance.delete(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { get, post, put, remove };
