import AxiosClient from "../../../config/AxiosClient";
import { CartItemType } from "../../Cart/CartItemType";

const checkOutApi = {
  order: (shipAddress: string, shipPhone: string, items: CartItemType[]) => {
    const orderItems: { itemId: number; quantity: number; type: number }[] = [];

    for (const item of items) {
      if (item.product) {
        orderItems.push({
          itemId: item.product.id,
          quantity: item.productQuantity || 0,
          type: 0,
        });
      } else if (item.combo) {
        orderItems.push({
          itemId: item.combo.id,
          quantity: item.comboQuantity || 0,
          type: 1,
        });
      } else {
        throw new Error("Invalid item");
      }
    }

    const orderData = {
      shipAddress,
      shipPhone,
      items: orderItems,
    };

    return AxiosClient.post("/customer/Orders", orderData);
  },
};

export default checkOutApi;
