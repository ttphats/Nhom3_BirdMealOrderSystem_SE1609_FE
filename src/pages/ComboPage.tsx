import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Container,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import { Cart } from "../modules/Cart";
import { ComboCard } from "../modules/Combo";
import { CartItemType } from "../modules/Cart/CartItemType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Combo } from "../modules/Combo/models";
import comboApi from "../modules/Combo/apis/comboApi";
import {
  addToCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../redux/slices/cartSlice";
import { useAppSelector } from "../redux/hooks";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AppRoutes from "../router/AppRoutes";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

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

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": {
    width: 320,
    boxShadow: theme.shadows[10],
  },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `#ccc !important`,
  },
}));

const SORT_OPTIONS = [
  { name: "Mới nhất", value: "desc", label: "Mới nhất" },
  { value: "", label: "Phổ biến" },
  { name: "Cũ nhất", value: "asc", label: "Cũ nhất" },
];

export default function ComboPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [combos, setCombos] = useState<Combo[]>([]);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useAppSelector((state) => state.profile.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const routeChange = (path: string) => {
    navigate(path, { replace: true });
  };

  const fetchListCombo = () => {
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
    fetchListCombo();
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
        comboQuantity:
          (updatedCartItems[existingCartItemIndex].comboQuantity ?? 0) + 1,
      };
      const quantity =
        updatedCartItems[existingCartItemIndex].comboQuantity || 0; // Handle undefined case
      dispatch(
        updateCartItemQuantity({
          item: updatedCartItems[existingCartItemIndex],
          quantity,
          isProduct: false,
        })
      );
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
      {user.role == "Customer" && (
        <StyledButton onClick={() => setCartOpen(true)}>
          <Badge badgeContent={getTotalItems(cartItems)} color="error">
            <AddShoppingCart />
          </Badge>
        </StyledButton>
      )}

      <Container sx={{ m: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom sx={{ color: "#000" }}>
            All combos
          </Typography>

          {user.role == "Staff" ? (
            <Button
              sx={{
                "&:hover": {
                  opacity: 0.8,
                  boxShadow: "none",
                },
              }}
              onClick={() => routeChange(AppRoutes.createCombo)}
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
            >
              Add combo
            </Button>
          ) : (
            <></>
          )}
        </Stack>

        <Stack
          mb={5}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <StyledSearch
            placeholder="Search product..."
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon
                  sx={{ color: "text.disabled", width: 20, height: 20 }}
                />
              </InputAdornment>
            }
          />
          <TextField select size="small">
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Grid container spacing={3}>
          {combos?.map((item) => (
            <Grid key={item.id} item xs={12} md={3}>
              <ComboCard item={item} handleAddToCart={handleAddToCart} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
