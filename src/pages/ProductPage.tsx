import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Pagination,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
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
import { useAppSelector } from "../redux/hooks";
import AppRoutes from "../router/AppRoutes";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

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
  { name: "Mới nhất", value: "true", label: "Mới nhất" },
  { value: "", label: "Phổ biến" },
  { name: "Cũ nhất", value: "false", label: "Cũ nhất" },
];

export default function ProductPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useAppSelector((state) => state.profile.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState<string>("true");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(1);

  const routeChange = (path: string) => {
    navigate(path, { replace: true });
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchListProduct(sortOption, page);
    }
  };

  const fetchListProduct = (sortOption: string, page: number) => {
    if (user.id != '') {
      productApi
        .authFetchAll(sortOption, page, itemsPerPage)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) => {
          const { data, pagination } = response;
          const { totalPages } = pagination;
          console.log(products);
          setProducts(data);
          setCurrentPage(page);
          setTotalPages(totalPages);
        })
        .catch((err) => console.log(err));
    } else {
      productApi
        .fetch(sortOption, page, itemsPerPage)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) => {
          const { data, pagination } = response;
          const { totalPages } = pagination;
          console.log(products);
          setProducts(data);
          setCurrentPage(page);
          setTotalPages(totalPages);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    fetchListProduct(sortOption, currentPage);
  }, [currentPage]);

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

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sortOption = event.target.value;
    setSortOption(sortOption);
    fetchListProduct(sortOption, currentPage);
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
            All products
          </Typography>

          {user.role == "Staff" ? (
            <Button
              sx={{
                "&:hover": {
                  opacity: 0.8,
                  boxShadow: "none",
                },
              }}
              onClick={() => routeChange(AppRoutes.createProduct)}
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
            >
              Add product
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
          <Box>
            <TextField
              select
              size="small"
              value={sortOption}
              onChange={handleSortChange}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem
                  key={option.value}
                  defaultValue={"true"}
                  value={option.value}
                >
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Stack>
        <Grid container spacing={3}>
          {products?.map((item) => (
            <Grid key={item.id} item xs={12} md={3}>
              <ProductCard item={item} handleAddToCart={handleAddToCart} />
            </Grid>
          ))}
        </Grid>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        />
      </Container>
    </>
  );
}
