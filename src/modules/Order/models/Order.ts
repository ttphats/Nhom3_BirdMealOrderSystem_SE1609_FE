export type Order = {
  id: number;
  customer: {
    id: number;
    name: null | string;
    email: string;
  };
  orderDate: Date;
  shipAddress: string;
  shipPhone: string;
  cancelBy: null | string;
  cancelDate: null | string;
  shippedBy: null | string;
  shipDate: null | string;
  paymentDate: null | string;
  totalAmount: number;
  status: number;
};
