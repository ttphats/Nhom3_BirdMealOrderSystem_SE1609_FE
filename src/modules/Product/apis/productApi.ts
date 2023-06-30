import AxiosClient from "../../../config/AxiosClient";
import { Product } from "../models";

const productApi = {
  fetch: (): Promise<Product[]> => AxiosClient.get("/guest/Products"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (form: any) =>
    AxiosClient.post(
      "/staff/Products",
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ),
};

export default productApi;
