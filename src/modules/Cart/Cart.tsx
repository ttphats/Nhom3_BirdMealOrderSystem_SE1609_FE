import { Box, Button } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { CartItemType } from "../../pages/ComboPage";
import CartItem from "./CartItems";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../router/AppRoutes";

type Props = {
  cartItems: CartItemType[];
  addToCart: (clickedItem: CartItemType) => void;
  removeFromCart: (id: number) => void;
};

const Cart = ({ cartItems, addToCart, removeFromCart }: Props) => {
  const navigate = useNavigate();

  const routeChange = (path: string, data: CartItemType[]) => {
    navigate(path, { replace: true, state: data });
  };
  const calculateTotal = (items: CartItemType[]) =>
    items.reduce((acc, item) => acc + item.amount * item.price, 0);

  return (
    <Box sx={{ width: "40rem", p: "20px" }}>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? <p>No items in cart.</p> : null}
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      ))}
      <h2>Total: {calculateTotal(cartItems).toFixed(2)} VND</h2>
      <Box
        sx={{ display: "flex", m: "auto" }}
        onClick={() => routeChange(AppRoutes.checkout, cartItems)}
      >
        <Button
          variant="contained"
          sx={{ bottom: 0, display: "flex", m: "auto" }}
          startIcon={<ShoppingCartCheckoutIcon />}
        >
          Check out
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;
