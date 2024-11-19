import { toast } from "vue-sonner";
import axios from "axios";


export const ApiWrapper = async (url, body) => {
  try {
    const response = await axios.post(
      `${process.env.API_KEY}/${url}`,
      body,
      {
        headers: {
          token: null,
        },
      }
    );

    return response.data;
  } catch (e) {
    toast.error(e.response?.data?.message || e.message);
    throw e;
  }
};
