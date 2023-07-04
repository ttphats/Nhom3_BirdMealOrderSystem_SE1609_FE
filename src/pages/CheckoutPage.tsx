import { useState, Fragment, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { PaymentForm, AddressForm, Review } from "../modules/Checkout";
import { AddressFormData } from "../modules/Checkout/AddressForm";
import { PaymentFormData } from "../modules/Checkout/PaymentForm";
import { useAppSelector } from "../redux/hooks";

const steps = ["Shipping address", "Payment details", "Review your order"];


const defaultAddressFormData: AddressFormData = {
  addressOption: "logged",
  phoneNum: "",
  address: "",
  ward: "",
  district: "",
  city: "",
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
  const user = useAppSelector((state) => state.profile.user.data);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        addressOption: "logged",
        phoneNum: user.phoneNum || "",
        address: user.address || "",
        saveAddress: false,
      });
    }
  }, [user]);

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
    <Paper
      elevation={3}
      sx={{ p: 2, borderRadius: "10px", maxWidth: "30rem", m: 2 }}
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
  );
}
