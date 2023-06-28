import AxiosClient from "../../../config/AxiosClient";

import { LoginForm, RegisterForm } from "../models";

const authApi = {
  register: (payload: RegisterForm) => {
    return AxiosClient.post("/Auth/sign-up", payload);
  },
  login: (
    payload: LoginForm
  ): Promise<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    accessToken: string;
  }> => {
    return AxiosClient.post("/Auth/login", payload);
  },
};

export default authApi;