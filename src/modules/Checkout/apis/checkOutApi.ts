import AxiosClient from "../../../config/AxiosClient";
import { CartItemType } from "../../Cart/CartItemType";

const checkOutApi = {
  order: (shipAddress: string, shipPhone: string, items: CartItemType[]) => {
    const orderPromises = items.map((item) => {
      if (item.product) {
        return AxiosClient.post("/customer/Orders", {
          shipAddress,
          shipPhone,
          items: [
            {
              itemId: item.product.id,
              quantity: item.productQuantity || 0, // Provide a default value of 0 for productQuantity if it's undefined
              type: 0,
            },
          ],
        });
      } else if (item.combo) {
        return AxiosClient.post("/customer/Orders", {
          shipAddress,
          shipPhone,
          items: [
            {
              itemId: item.combo.id,
              quantity: item.comboQuantity || 0, // Provide a default value of 0 for comboQuantity if it's undefined
              type: 1,
            },
          ],
        });
      }
      return Promise.reject(new Error("Invalid item")); // Reject the promise for an invalid item
    });

    return Promise.all(orderPromises); // Return a promise that resolves when all order requests have been completed
  },
};

export default checkOutApi;
