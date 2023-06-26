import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Box, Button } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SendIcon from '@mui/icons-material/Send';

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
              name="cardName"
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
              label="Card number"
              name="cardNumber"
              required
              fullWidth
              variant="standard"
              value={paymentFormData.cardNumber || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="expDate"
              label="Expiry date"
              name="expDate"
              required
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
              name="cvv"
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Button onClick={handleBack} variant="text" startIcon={<ArrowBackIosIcon />}>
            Back
          </Button>
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            Next
          </Button>
        </Box>
      </form>
    </React.Fragment>
  );
}
