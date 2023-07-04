export type Order = {
  id: number;
  customer: {
    id: number;
    fullName: null | string;
    email: string;
  };
  orderDate: Date;
  shipAddress: string;
  shipPhone: string;
  cancelBy: null | string;
  cancelDate: null | string;
  shippedBy: {
    id: number;
    fullName: null | string;
    email: null | string;
  };
  shipDate: null | string;
  paymentDate: null | string;
  totalAmount: number;
  status: number;
};
