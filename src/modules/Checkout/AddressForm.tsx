import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";
import { useAppSelector } from "../../redux/hooks";

export interface AddressFormData {
  addressOption: "logged" | "fill"; // Add addressOption property
  phoneNum: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  saveAddress: boolean;
}

interface AddressFormProps {
  formData: AddressFormData;
  setFormData: React.Dispatch<React.SetStateAction<AddressFormData>>;
  handleNext: () => void;
}

export default function AddressForm({
  formData,
  setFormData,
  handleNext,
}: AddressFormProps) {
  const user = useAppSelector((state) => state.profile.user.data);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "logged") {
      setFormData({
        ...formData,
        addressOption: "logged",
        phoneNum: user.phoneNum || "",
        address: user.address || "",
        saveAddress: false,
      });
    } else {
      // Reset form data to default values
      setFormData({
        ...formData,
        addressOption: "fill",
        phoneNum: "",
        address: "",
        ward: "",
        district: "",
        city: "",
        country: "",
        saveAddress: false,
      });
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log(formData);
    event.preventDefault();
    handleNext();
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <label>
              <input
                type="radio"
                name="addressOption"
                value="logged"
                checked={formData.addressOption === "logged"}
                onChange={handleOptionChange}
              />{" "}
              Get address from logged account
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="addressOption"
                value="fill"
                checked={formData.addressOption === "fill"}
                onChange={handleOptionChange}
              />{" "}
              Fill in the form
            </label>
          </Grid>
          {formData.addressOption === "fill" && (
            <>
              <Grid item xs={12}>
                <TextField
                  required
                  id="phoneNum"
                  name="phoneNum"
                  label="Phone Number"
                  fullWidth
                  autoComplete="phoneNum-line1"
                  variant="standard"
                  value={formData.phoneNum || ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="address"
                  name="address"
                  label="Address line 1"
                  fullWidth
                  autoComplete="shipping address-line1"
                  variant="standard"
                  value={formData.address || ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="ward"
                  name="ward"
                  label="Ward"
                  fullWidth
                  autoComplete="shipping ward"
                  variant="standard"
                  value={formData.ward || ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="district"
                  name="district"
                  label="District"
                  fullWidth
                  autoComplete="shipping district"
                  variant="standard"
                  value={formData.district || ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="city"
                  name="city"
                  label="City"
                  fullWidth
                  autoComplete="shipping city"
                  variant="standard"
                  value={formData.city || ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="country"
                  name="country"
                  label="Country"
                  fullWidth
                  autoComplete="shipping country"
                  variant="standard"
                  value={formData.country || ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="secondary"
                      name="saveAddress"
                      checked={formData.saveAddress}
                      onChange={handleChange}
                    />
                  }
                  label="Use this address for payment details"
                />
              </Grid>
            </>
          )}
        </Grid>
        <Button type="submit" variant="contained">
          Next
        </Button>
      </form>
    </React.Fragment>
  );
}
