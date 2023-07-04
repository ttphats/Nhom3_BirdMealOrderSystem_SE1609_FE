import AxiosClient from "../../../config/AxiosClient";
import { Product } from "../models";

const productApi = {
  fetch: (sortOption: string, page: number, pageSize: number): Promise<Product[]> =>
    AxiosClient.get(`/guest/Products?descending=${sortOption}&page=${page}&pageSize=${pageSize}`),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (form: any) =>
    AxiosClient.post("/staff/Products", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getDetails: (id: number): Promise<Product> =>
    AxiosClient.get(`/guest/Products/${id}`),
};

export default productApi;
