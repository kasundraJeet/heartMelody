import { toast } from "vue-sonner";
import axios from "axios";

export const ApiWrapper = async (url, body) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/${url}`,
      body,
      {
        headers: {
          token: authStore.sessionToken || null,
        },
      }
    );

    return response.data;
  } catch (e) {
    toast.error(e.response?.data?.message || e.message);
    throw e;
  }
};
