import { useEffect, useState } from "react";
import { Badge, Drawer, Grid, IconButton, styled } from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import { Cart } from "../modules/Cart";
import ProductCard from "../modules/Product/ProductCard";
import { Product } from "../modules/Product/models";
import productApi from "../modules/Product/apis/productApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CartItemType } from "../modules/Cart/CartItemType";
import {
  addToCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../redux/slices/cartSlice";

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

export default function ProductPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const fetchListProduct = () => {
    productApi
      .fetch()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: any) => {
        const products = response.data;
        console.log(products);
        setProducts(products);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchListProduct();
  }, []);

  const getTotalItems = (items: CartItemType[]): number => {
    return items.reduce(
      (total: number, item: CartItemType) =>
        total + (item.productQuantity ?? 0) + (item.comboQuantity ?? 0),
      0
    );
  };
  const handleAddToCart = (item: Product) => {
    const existingCartItem = cartItems.find(
      (cartItem) => cartItem.product?.id === item.id
    );

    if (existingCartItem) {
      const updatedQuantity = (existingCartItem.productQuantity ?? 0) + 1;
      dispatch(
        updateCartItemQuantity({
          item: existingCartItem,
          quantity: updatedQuantity,
          isProduct: true,
        })
      );
    } else {
      dispatch(addToCart({ product: item, productQuantity: 1 }));
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
        {products?.map((item) => (
          <Grid key={item.id} item xs={12} md={3}>
            <ProductCard
              item={item}
              handleAddToCart={handleAddToCart}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
