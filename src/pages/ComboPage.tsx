import { useState } from "react";
import { Badge, Drawer, Grid, IconButton, styled } from "@mui/material";
import { ComboCard } from "../modules/Combo";
import { AddShoppingCart } from "@mui/icons-material";
import { Cart } from "../modules/Cart";

export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

const mockData: CartItemType[] = [
  {
    id: 1,
    category: "electronics",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image:
      "https://avianreport.com/wp-content/uploads/2020/07/mosaic_optimized2.jpg",
    price: 9.99,
    title: "Product 1",
    amount: 2,
  },
  {
    id: 2,
    category: "clothing",
    description: "Nulla facilisi. Sed accumsan felis nec orci lacinia.",
    image:
      "https://avianreport.com/wp-content/uploads/2020/07/mosaic_optimized2.jpg",
    price: 19.99,
    title: "Product 2",
    amount: 3,
  },
  {
    id: 3,
    category: "clothing",
    description: "Nulla facilisi. Sed accumsan felis nec orci lacinia.",
    image:
      "https://avianreport.com/wp-content/uploads/2020/07/mosaic_optimized2.jpg",
    price: 19.99,
    title: "Product 3",
    amount: 4,
  },
  {
    id: 4,
    category: "clothing",
    description: "Nulla facilisi. Sed accumsan felis nec orci lacinia.",
    image:
      "https://avianreport.com/wp-content/uploads/2020/07/mosaic_optimized2.jpg",
    price: 19.99,
    title: "Product 4",
    amount: 5,
  },
  {
    id: 5,
    category: "clothing",
    description: "Nulla facilisi. Sed accumsan felis nec orci lacinia.",
    image:
      "https://avianreport.com/wp-content/uploads/2020/07/mosaic_optimized2.jpg",
    price: 19.99,
    title: "Product 5",
    amount: 2,
  },
  {
    id: 6,
    category: "clothing",
    description: "Nulla facilisi. Sed accumsan felis nec orci lacinia.",
    image:
      "https://avianreport.com/wp-content/uploads/2020/07/mosaic_optimized2.jpg",
    price: 19.99,
    title: "Product 6",
    amount: 3,
  },
  {
    id: 7,
    category: "clothing",
    description: "Nulla facilisi. Sed accumsan felis nec orci lacinia.",
    image:
      "https://avianreport.com/wp-content/uploads/2020/07/mosaic_optimized2.jpg",
    price: 19.99,
    title: "Product 7",
    amount: 8,
  },
  {
    id: 8,
    category: "clothing",
    description: "Nulla facilisi. Sed accumsan felis nec orci lacinia.",
    image:
      "https://avianreport.com/wp-content/uploads/2020/07/mosaic_optimized2.jpg",
    price: 19.99,
    title: "Product 8",
    amount: 3,
  },
];

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

// const getProducts = async (): Promise<CartItemType[]> =>
//   await (await fetch("https://fakestoreapi.com/products")).json();

export default function ComboPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const getTotalItems = (items: CartItemType[]): number => {
    return items.reduce(
      (acc: number, item: CartItemType) => acc + item.amount,
      0
    );
  };

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems((prev) => {
      const isItemInCart = prev.find((item) => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map((item) =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }

      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems((prev) =>
      prev.reduce((acc, item) => {
        if (item.id === id) {
          if (item.amount === 1) return acc;
          return [...acc, { ...item, amount: item.amount - 1 }];
        } else {
          return [...acc, item];
        }
      }, [] as CartItemType[])
    );
  };

  return (
    <>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCart />
        </Badge>
      </StyledButton>
      <Grid container spacing={2} sx={{ m: 2 }}>
        {mockData?.map((item) => (
          <Grid key={item.id} item xs={12} md={3}>
            <ComboCard item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
