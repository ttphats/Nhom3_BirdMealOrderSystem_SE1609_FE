import { Fragment } from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import { useLocation, useNavigate } from "react-router-dom";
import { AddressFormData } from "./AddressForm";
import { Box, Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SendIcon from "@mui/icons-material/Send";
import { CartItemType } from "../Cart/CartItemType";
import checkOutApi from "./apis/checkOutApi";
import { toast } from "react-toastify";
import AppRoutes from "../../router/AppRoutes";
import { clearCart } from "../../redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/hooks";

interface ReviewFormProps {
  formData: AddressFormData;
  handleBack: () => void;
}

export default function Review({ formData, handleBack }: ReviewFormProps) {
  const location = useLocation();
  const cartItems = location.state;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.profile.user.data);

  const address = `${formData.address}${
    formData.ward ? `, ${formData.ward}` : ""
  }${formData.city ? `, ${formData.city}` : ""}${
    formData.country ? `, ${formData.country}` : ""
  }`;

  const calculateTotalPrice = () => {
    return cartItems.reduce((total: number, item: CartItemType) => {
      if (item.product) {
        return total + item.product.price * item.productQuantity!;
      } else if (item.combo) {
        return total + item.combo.price * item.comboQuantity!;
      }
      return total;
    }, 0);
  };

  const handleConfirmClick = () => {
    const items: CartItemType[] = cartItems.map((item: CartItemType) => {
      if (item.product) {
        return {
          product: item.product,
          productQuantity: item.productQuantity,
        };
      } else if (item.combo) {
        return {
          combo: item.combo,
          comboQuantity: item.comboQuantity,
        };
      }
      throw new Error("Invalid item");
    });

    checkOutApi
      .order(address, formData.phoneNum, items)
      .then(() => {
        toast.success("Order successfully");
        dispatch(clearCart());
        navigate(AppRoutes.home);
      })
      .catch(() => {
        toast.error("Something went wrong. Please try again!");
      });
  };
  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {cartItems.map((item: CartItemType) => (
          <ListItem
            key={item.product?.id || item.combo?.id}
            sx={{ py: 1, px: 0 }}
          >
            <ListItemText primary={item.product?.name || item.combo?.name} />
            <Typography variant="body2">
              {item.product?.price.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              }) ||
                item.combo?.price.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })}{" "}
            </Typography>
          </ListItem>
        ))}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {calculateTotalPrice().toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Shipping
          </Typography>
          <Typography gutterBottom>{user.fullname}</Typography>
          <Typography gutterBottom>{address}</Typography>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={handleBack}
          variant="text"
          startIcon={<ArrowBackIosIcon />}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleConfirmClick}
        >
          Confirm Order
        </Button>
      </Box>
    </Fragment>
  );
}
