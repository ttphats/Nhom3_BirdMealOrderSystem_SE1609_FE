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
import { AddShoppingCart, Search as SearchIcon } from "@mui/icons-material";
import { Cart } from "../modules/Cart";
import { ComboCard } from "../modules/Combo";
import { CartItemType } from "../modules/Cart/CartItemType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { BirdSpecies, Combo } from "../modules/Combo/models";
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

export default function ComboPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [bird, setBirds] = useState<BirdSpecies[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Combo[]>([]);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useAppSelector((state) => state.profile.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState<string>("true");
  const [selectedBirdId, setSelectedBirdId] = useState<number>(0);
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
      const birdIdParam = selectedBirdId == 0 ? "" : String(selectedBirdId);
      fetchListCombo(sortOption, birdIdParam, page);
    }
  };
  const fetchListCombo = (sortOption: string, birdId: string, page: number) => {
    comboApi
      .fetch(sortOption, birdId, page, itemsPerPage)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: any) => {
        const { data, pagination } = response;
        const { totalPages } = pagination;
        setCombos(data);
        setCurrentPage(page);
        setTotalPages(totalPages);
      })
      .catch((err) => console.log(err));
  };

  const fetchListBird = () => {
    comboApi
      .getBird()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: any) => {
        const b = response.data;
        setBirds(b);
      })
      .catch((err) => console.log(err));
  };

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
        updatedCartItems[existingCartItemIndex].comboQuantity || 0;
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

  const performSearch = (query: string) => {
    comboApi
      .search(query)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: any) => {
        const combos = response.data;
        setSearchResults(combos);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        console.error("Error searching combos:", error);
      });
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sortOption = event.target.value;
    setSortOption(sortOption);
    const birdIdParam = selectedBirdId == 0 ? "" : String(selectedBirdId);
    fetchListCombo(sortOption, birdIdParam, currentPage);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  const handleBirdChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const birdId = event.target.value as number;
    setSelectedBirdId(birdId);
    const birdIdParam = birdId == 0 ? "" : String(birdId);
    fetchListCombo(sortOption, birdIdParam, currentPage);
  };

  useEffect(() => {
    const birdIdParam = selectedBirdId == 0 ? "" : String(selectedBirdId);
    fetchListCombo(sortOption, birdIdParam, currentPage);
    fetchListBird();
  }, []);

  return (
    <>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          removeCartItem={handleRemoveItem}
          updateCartItemQuantity={handleUpdateQuantity}
        />
      </Drawer>
      {user.role === "Customer" && (
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

          {user.role === "Staff" && (
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
          )}
        </Stack>

        <Stack
          mb={5}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <StyledSearch
            placeholder="Search combo..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
          <Box>
            <TextField
              select
              size="small"
              value={selectedBirdId}
              onChange={handleBirdChange}
              sx={{ mr: 2 }}
            >
              <MenuItem value={0}>Sort by bird</MenuItem>
              {bird.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
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
          {searchResults.length > 0
            ? searchResults.map((item) => (
                <Grid key={item.id} item xs={12} md={3}>
                  <ComboCard item={item} handleAddToCart={handleAddToCart} />
                </Grid>
              ))
            : combos.map((item) => (
                <Grid key={item.id} item xs={12} md={3}>
                  <ComboCard item={item} handleAddToCart={handleAddToCart} />
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
