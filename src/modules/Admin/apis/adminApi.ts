import AxiosClient from "../../../config/AxiosClient";
import { Account } from "../models/Account";

const adminApi = {
  productExpireSoon: () =>
    AxiosClient.get("/admin/Chart/products/expiring-soon"),
  productActive: () =>
    AxiosClient.get("/admin/Chart/statistics/products/active"),
  productInActive: () =>
    AxiosClient.get("/admin/Chart/statistics/products/In-active"),
  productOutOfStock: () =>
    AxiosClient.get("/admin/Chart/statistics/products/OutOfStock"),
  comboActive: () => AxiosClient.get("/admin/Chart/statistics/combos/active"),
  comboInActive: () =>
    AxiosClient.get("/admin/Chart/statistics/combos/In-active"),
  orderCompleted: () =>
    AxiosClient.get("/admin/Chart/statistics/orders/completed"),
  orderCancelled: () =>
    AxiosClient.get("/admin/Chart/statistics/orders/cancelled"),
  orderProcessing: () =>
    AxiosClient.get("/admin/Chart/statistics/orders/processing"),
  orderWaiting: () => AxiosClient.get("/admin/Chart/statistics/orders/waiting"),
  getCustomer: (): Promise<Account> =>
    AxiosClient.get("/admin/Users/UserAsCustomer"),
  getStaff: (): Promise<Account> => AxiosClient.get("/admin/Users/UserAsStaff"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateAccount: (userId: number, form: any) =>
    AxiosClient.put(`/admin/Users/${userId}`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  banAccount: (userId: number) => AxiosClient.delete(`/admin/Users/Ban/${userId}`),

};

export default adminApi;
