import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";

export interface PaymentFormData {
  cardName: string;
  cardNumber: string;
  expDate: string;
  cvv: string;
  saveCard: boolean;
}

interface PaymentFormProps {
  paymentFormData: PaymentFormData;
  setPaymentFormData: React.Dispatch<React.SetStateAction<PaymentFormData>>;
  handleNext: () => void;
  handleBack: () => void;
}

export default function PaymentForm({
  paymentFormData,
  setPaymentFormData,
  handleNext,
  handleBack,
}: PaymentFormProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentFormData({
      ...paymentFormData,
      [event.target.name]: event.target.value,
    });
  };
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log(paymentFormData);
    event.preventDefault();
    handleNext();
  };
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              id="cardName"
              required
              label="Name on card"
              fullWidth
              variant="standard"
              value={paymentFormData.cardName || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="cardNumber"
              required
              label="Card number"
              fullWidth
              variant="standard"
              value={paymentFormData.cardNumber || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="expDate"
              required
              label="Expiry date"
              fullWidth
              variant="standard"
              value={paymentFormData.expDate || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="cvv"
              label="CVV"
              required
              helperText="Last three digits on signature strip"
              fullWidth
              variant="standard"
              value={paymentFormData.cvv || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  name="saveCard"
                  value={paymentFormData.saveCard || "yes"}
                  onChange={handleChange}
                />
              }
              label="Remember credit card details for next time"
            />
          </Grid>
        </Grid>
        <Button onClick={handleBack} variant="contained">Back</Button>
        <Button type="submit" variant="contained">Next</Button>
      </form>
    </React.Fragment>
  );
}
