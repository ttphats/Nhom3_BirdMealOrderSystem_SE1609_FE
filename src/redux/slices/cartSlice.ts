import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItemType } from "../../modules/Cart/CartItemType";

interface CartState {
  items: CartItemType[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItemType>) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => {
        if (newItem.product) {
          return item.product?.id === newItem.product.id;
        } else if (newItem.combo) {
          return item.combo?.id === newItem.combo.id;
        }
        return false;
      });

      if (existingItem) {
        if (newItem.product && existingItem.product) {
          existingItem.productQuantity = existingItem.productQuantity
            ? existingItem.productQuantity + 1
            : 1;
        } else if (newItem.combo && existingItem.combo) {
          existingItem.comboQuantity = existingItem.comboQuantity
            ? existingItem.comboQuantity + 1
            : 1;
        }
      } else {
        state.items.push(newItem);
      }
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{
        item: CartItemType;
        quantity: number;
        isProduct: boolean;
      }>
    ) => {
      const { item, quantity, isProduct } = action.payload;
    
      const cartItem = state.items.find((i) => {
        if (isProduct && item.product) {
          return i.product?.id === item.product.id;
        } else if (!isProduct && item.combo) {
          return i.combo?.id === item.combo.id;
        }
        return false;
      });
    
      if (cartItem) {
        if (isProduct) {
          cartItem.productQuantity = quantity;
        } else {
          cartItem.comboQuantity = quantity;
        }
      }
    },
    removeCartItem: (state, action: PayloadAction<CartItemType>) => {
      const { product, combo } = action.payload;
      state.items = state.items.filter((item) => {
        if (item.product && product) {
          return item.product.id !== product.id;
        } else if (item.combo && combo) {
          return item.combo.id !== combo.id;
        }
        return true;
      });
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, updateCartItemQuantity, removeCartItem, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
