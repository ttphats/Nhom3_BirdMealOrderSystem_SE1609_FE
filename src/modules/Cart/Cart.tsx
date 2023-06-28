import React from "react";
import { Box, Button } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../router/AppRoutes";
import { CartItemType } from "./CartItemType";
import CartItem from "./CartItems";

type Props = {
  cartItems: CartItemType[]; 
  removeCartItem: (item: CartItemType) => void;
  updateCartItemQuantity: (
    item: CartItemType,
    quantity: number,
    isProduct: boolean
  ) => void;
};

const Cart: React.FC<Props> = ({
  cartItems,
  removeCartItem,
  updateCartItemQuantity,
}) => {
  const navigate = useNavigate();

  const handleRemoveFromCart = (item: CartItemType) => {
    removeCartItem(item);
  };

  const handleUpdateQuantity = (
    item: CartItemType,
    quantity: number,
    isProduct: boolean
  ) => {
    updateCartItemQuantity(item, quantity, isProduct);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      if (item.product) {
        return total + item.product.price * item.productQuantity!;
      } else if (item.combo) {
        return total + item.combo.price * item.comboQuantity!;
      }
      return total;
    }, 0);
  };

  const routeChange = (path: string, data: CartItemType[]) => {
    navigate(path, { replace: true, state: data });
  };

  return (
    <Box sx={{ width: "40rem", p: "20px" }}>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? <p>No items in cart.</p> : null}
      {cartItems.map((item) => (
        <CartItem
          key={item.product?.id || item.combo?.id}
          item={item}
          removeCartItem={handleRemoveFromCart}
          updateCartItemQuantity={handleUpdateQuantity}
        />
      ))}
      <h2>Total: {calculateTotalPrice().toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</h2>
      <Box sx={{ display: "flex", m: "auto" }}>
        <Button
          variant="contained"
          sx={{ bottom: 0, display: "flex", m: "auto" }}
          startIcon={<ShoppingCartCheckoutIcon />}
          onClick={() => routeChange(AppRoutes.checkout, cartItems)}
        >
          Check out
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;
