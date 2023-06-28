import React from "react";
import {
  Box,
  Button,
  ButtonBase,
  Grid,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import { CartItemType } from "./CartItemType";

type Props = {
  item: CartItemType;
  removeCartItem: (item: CartItemType) => void;
  updateCartItemQuantity: (
    item: CartItemType,
    quantity: number,
    isProduct: boolean
  ) => void;
};

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

const CartItem: React.FC<Props> = ({
  item,
  removeCartItem,
  updateCartItemQuantity,
}) => {
  const handleRemoveFromCart = () => {
    removeCartItem(item);
  };

  const handleUpdateQuantity = (isProduct: boolean, quantity: number) => {
    updateCartItemQuantity(item, quantity, isProduct);
  };

  const getItemPrice = (): number => {
    if (item.product) {
      return (item.product.price || 0) * (item.productQuantity || 0);
    } else if (item.combo) {
      return (item.combo.price || 0) * (item.comboQuantity || 0);
    }
    return 0;
  };

  const getItemTitle = (): string => {
    if (item.product) {
      return item.product.name;
    } else if (item.combo) {
      return item.combo.name;
    }
    return "";
  };

  const handleIncrementQuantity = (isProduct: boolean) => {
    const newQuantity = isProduct
      ? (item.productQuantity ?? 0) + 1
      : (item.comboQuantity ?? 0) + 1;
    handleUpdateQuantity(isProduct, newQuantity);
  };

  const handleDecrementQuantity = (isProduct: boolean) => {
    const currentQuantity = isProduct
      ? item.productQuantity ?? 0
      : item.comboQuantity ?? 0;

    if (currentQuantity - 1 > 0) {
      const newQuantity = currentQuantity - 1;
      handleUpdateQuantity(isProduct, newQuantity);
    } else {
      removeCartItem(item);
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        margin: "auto",
        maxWidth: 500,
        flexGrow: 1,
        backgroundColor: "#282d3e",
        color: "#fff",
        mb: 2,
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            {(item.product && (
              <Img alt="Product" src={item.product.imgUrl} />
            )) ||
              (item.combo && <Img alt="Product" src={item.combo.imgUrl} />)}
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                {getItemTitle()}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {item.product ? (
                  <Button
                    size="small"
                    disableElevation
                    variant="contained"
                    onClick={() => handleDecrementQuantity(true)}
                  >
                    -
                  </Button>
                ) : (
                  <Button
                    size="small"
                    disableElevation
                    variant="contained"
                    onClick={() => handleDecrementQuantity(false)}
                  >
                    -
                  </Button>
                )}

                <p>
                  {item.product
                    ? item.productQuantity
                    : item.combo && item.comboQuantity}
                </p>
                {item.product ? (
                  <Button
                    size="small"
                    disableElevation
                    variant="contained"
                    onClick={() => handleIncrementQuantity(true)}
                  >
                    +
                  </Button>
                ) : (
                  <Button
                    size="small"
                    disableElevation
                    variant="contained"
                    onClick={() => handleIncrementQuantity(false)}
                  >
                    +
                  </Button>
                )}
                <Button
                  size="small"
                  disableElevation
                  variant="contained"
                  color="error"
                  onClick={handleRemoveFromCart}
                >
                  Remove
                </Button>
              </Box>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" component="div">
                Total:{" "}
                {getItemPrice().toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CartItem;
