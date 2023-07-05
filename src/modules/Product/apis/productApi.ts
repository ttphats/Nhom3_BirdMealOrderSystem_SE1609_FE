import AxiosClient from "../../../config/AxiosClient";
import { Product } from "../models";

const productApi = {
  fetchAll: (): Promise<Product[]> => AxiosClient.get(`/guest/Products`),
  fetch: (
    sortOption: string,
    page: number,
    pageSize: number
  ): Promise<Product[]> =>
    AxiosClient.get(
      `/guest/Products?descending=${sortOption}&page=${page}&pageSize=${pageSize}`
    ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (form: any) =>
    AxiosClient.post("/staff/Products", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (form: any, id: number) =>
    AxiosClient.put(`/staff/Products/${id}`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  delete: (id: number) => AxiosClient.delete(`/staff/Products/${id}`),
  getDetails: (id: number): Promise<Product> =>
    AxiosClient.get(`/guest/Products/${id}`),
};

export default productApi;
