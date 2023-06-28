import { useEffect, useState } from "react";
import { Badge, Drawer, Grid, IconButton, styled } from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import { Cart } from "../modules/Cart";
import { ComboCard } from "../modules/Combo";
import { CartItemType } from "../modules/Cart/CartItemType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Combo } from "../modules/Combo/models";
import comboApi from "../modules/Combo/apis/comboApi";
import { addToCart, removeCartItem, updateCartItemQuantity } from "../redux/slices/cartSlice";

const StyledButton = styled(IconButton)`
  position: fixed;
  z-index: 9999;
  right: 20px;
  background-color: #fff;
  color: #000;
  border-radius: 20px;
  width: 45px;
  height: 30px;
  top: 100px;
`;

export default function ComboPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [combos, setCombos] = useState<Combo[]>([]);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const fetchListConbo = () => {
    comboApi
      .fetch()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: any) => {
        const combos = response.data;
        setCombos(combos);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchListConbo();
  }, []);

  const getTotalItems = (items: CartItemType[]): number => {
    return items.reduce(
      (total: number, item: CartItemType) =>
        total + (item.productQuantity ?? 0) + (item.comboQuantity ?? 0),
      0
    );
  };
  const handleAddToCart = (item: Combo) => {
    const existingCartItemIndex: number = cartItems.findIndex(
      (cartItem) => cartItem.combo?.id === item.id
    );
  
    if (existingCartItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingCartItemIndex] = {
        ...updatedCartItems[existingCartItemIndex],
        comboQuantity: (updatedCartItems[existingCartItemIndex].comboQuantity ?? 0) + 1,
      };
      const quantity = updatedCartItems[existingCartItemIndex].comboQuantity || 0; // Handle undefined case
      dispatch(updateCartItemQuantity({
        item: updatedCartItems[existingCartItemIndex],
        quantity,
        isProduct: false,
      }));
    } else {
      dispatch(addToCart({ combo: item, comboQuantity: 1 }));
    }
  };

  const handleUpdateQuantity = (
    item: CartItemType,
    quantity: number,
    isProduct: boolean
  ) => {
    const updatedItem: {
      item: CartItemType;
      quantity: number;
      isProduct: boolean;
    } = {
      item,
      quantity,
      isProduct,
    };

    dispatch(updateCartItemQuantity(updatedItem));
  };
  const handleRemoveItem = (item: CartItemType) => {
    dispatch(removeCartItem(item));
  };

  return (
    <>
       <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          removeCartItem={handleRemoveItem}
          updateCartItemQuantity={handleUpdateQuantity}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCart />
        </Badge>
      </StyledButton>
      <Grid container spacing={2} sx={{ m: 2 }}>
        {combos?.map((item) => (
          <Grid key={item.id} item xs={12} md={3}>
            <ComboCard
              item={item}
              handleAddToCart={handleAddToCart}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
