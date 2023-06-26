import { useState, Fragment, useEffect } from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import { useLocation } from "react-router-dom";
import { CartItemType } from "../../../pages/ComboPage";
import { AddressFormData } from "./AddressForm";
import { PaymentFormData } from "./PaymentForm";
import { Button, Snackbar } from "@mui/material";

interface PaymentFormProps {
  formData: AddressFormData;
  paymentFormData: PaymentFormData;
}

export default function Review({
  formData,
  paymentFormData,
}: PaymentFormProps) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const location = useLocation();
  const cartItems = location.state;
  const [total, setTotal] = useState(0);

  const payments = [
    { name: "Card type", detail: "Visa" },
    { name: "Card holder", detail: paymentFormData.cardName ? paymentFormData.cardName : "Thai Thanh Phat"},
    { name: "Card number", detail: paymentFormData.cardNumber ? paymentFormData.cardNumber : "xxxx-xxxx-xxxx-1234"},
    { name: "Expiry date", detail: paymentFormData.expDate ? paymentFormData.expDate : "04/2024" },
  ];

  useEffect(() => {
    const totalPrice = cartItems.reduce(
      (acc: number, item: CartItemType) => acc + item.price,
      0
    );

    setTotal(totalPrice);
  }, [cartItems]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleConfirmClick = () => {
    setSnackbarOpen(true);
  };

  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {cartItems.map((item: CartItemType) => (
          <ListItem key={item.title} sx={{ py: 1, px: 0 }}>
            <ListItemText primary={item.title} secondary={item.description} />
            <Typography variant="body2">{item.price} VND</Typography>
          </ListItem>
        ))}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {total} VND
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Shipping
          </Typography>
          <Typography gutterBottom>
            {formData.firstName} {formData.lastName}
          </Typography>
          <Typography gutterBottom>
            {formData.address1}, {formData.address2}, {formData.city},{" "}
            {formData.state}, {formData.zip}, {formData.country}{" "}
          </Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Payment details
          </Typography>
          <Grid container>
            {payments.map((payment) => (
              <Fragment key={payment.name}>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.detail}</Typography>
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" onClick={handleConfirmClick}>
        Confirm Order
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Order placed successfully!"
      />
    </Fragment>
  );
}
