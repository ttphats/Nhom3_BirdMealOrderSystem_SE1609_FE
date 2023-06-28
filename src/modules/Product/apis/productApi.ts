import AxiosClient from "../../../config/AxiosClient";
import { Product } from "../models";

const productApi = {
  fetch: (): Promise<Product[]> => AxiosClient.get("/guest/Products"),
};

export default productApi;