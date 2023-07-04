import AxiosClient from "../../../config/AxiosClient";
import { Order } from "../models";

const orderApi = {
  customerFetch: (): Promise<Order[]> => AxiosClient.get("/customer/Orders"),
  cancelOrder: (orderId: number) =>
    AxiosClient.delete(`/customer/Orders/${orderId}`),
};

export default orderApi;
