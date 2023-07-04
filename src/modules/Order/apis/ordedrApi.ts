import AxiosClient from "../../../config/AxiosClient";
import { Order } from "../models";

const orderApi = {
  customerFetch: (): Promise<Order[]> => AxiosClient.get("/customer/Orders"),
  staffFetch: (): Promise<Order[]> => AxiosClient.get("/staff/Orders"),
  cancelOrder: (orderId: number) =>
    AxiosClient.delete(`/customer/Orders/${orderId}`),
  staffCancelOrder: (orderId: number) =>
    AxiosClient.delete(`/staff/Orders/${orderId}/cancel`),
  staffConfirmOrder: (orderId: number) =>
    AxiosClient.put(`/staff/Orders/${orderId}/confirm`),
  staffDoneOrder: (orderId: number) =>
    AxiosClient.put(`/staff/Orders/${orderId}/Shipped`),
};

export default orderApi;
