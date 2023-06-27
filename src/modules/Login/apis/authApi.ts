import AxiosClient from "../../../config/AxiosClient";

import { LoginForm, RegisterForm } from "../models";

const authApi = {
  register: (payload: RegisterForm) => {
    return AxiosClient.post("/Auth/sign-up", payload);
  },
  login: (
    payload: LoginForm
  ): Promise<{
    accessToken: string;
  }> => {
    return AxiosClient.post("/Auth/login", payload);
  },
};

export default authApi;