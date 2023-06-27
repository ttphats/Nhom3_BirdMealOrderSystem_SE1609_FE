import AxiosClient from "../../../config/AxiosClient";
import { User } from "../models";

const profileApi = {
  fetch: (): Promise<User> => AxiosClient.get("/Account/profile"),
};

export default profileApi;