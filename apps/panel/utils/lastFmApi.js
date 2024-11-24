import { toast } from "vue-sonner";
import axios from "axios";

export const LastFmApiWrapper = async (url) => {
  try {
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (e) {
    toast.error(e.response?.data?.message || e.message || "An error occurred");
    throw e;
  }
};
