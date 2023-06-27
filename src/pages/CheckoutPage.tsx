import { useState, Fragment } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  PaymentForm,
  AddressForm,
  Review,
} from "../modules/Checkout";
import Copyright from "../common/components/Copyright";
import { AddressFormData } from "../modules/Checkout/AddressForm";
import { PaymentFormData } from "../modules/Checkout/PaymentForm";

const steps = ["Shipping address", "Payment details", "Review your order"];

const defaultTheme = createTheme();

const defaultAddressFormData: AddressFormData = {
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  saveAddress: false,
};

const defaultPaymentFormData: PaymentFormData = {
  cardName: "",
  cardNumber: "",
  expDate: "",
  cvv: "",
  saveCard: false,
};

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<AddressFormData>(
    defaultAddressFormData
  );
  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>(
    defaultPaymentFormData
  );

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <AddressForm
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNext}
          />
        );
      case 1:
        return (
          <PaymentForm
            paymentFormData={paymentFormData}
            setPaymentFormData={setPaymentFormData}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 2:
        return (
          <Review
            formData={formData}
            paymentFormData={paymentFormData}
            handleBack={handleBack}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 1,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Bird Meal Order System - Team 3
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Fragment>
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1">
                Your order number is #2001539. We have emailed your order
                confirmation, and will send you an update when your order has
                shipped.
              </Typography>
            </Fragment>
          ) : (
            <Fragment>{getStepContent(activeStep)}</Fragment>
          )}
        </Paper>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}
