import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { CreateProductForm } from "../modules/Product/models";
import productApi from "../modules/Product/apis/productApi";
import { toast } from "react-toastify";

const CreateProductPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [fileUpload, setFileUpLoad] = useState<File | null>(null);
  const today = new Date();

  const validatePrice = (value: number) => {
    return value >= 500 || "Price must be greater than or equal to 500";
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    if (fileUpload) {
      const payload: CreateProductForm = {
        form: {
          Name: data.Name,
          Description: data.Description,
          UnitInStock: data.UnitInStock,
          Price: data.Price,
          ExpiredDate: data.ExpiredDate,
          Status: data.Status,
        },
        imageFile: fileUpload,
      };

      const formData = new FormData();
      formData.append("form", JSON.stringify(payload.form));
      formData.append("imageFile", fileUpload);

      productApi
        .create(formData)
        .then((response) => {
          toast.success(response.data.message);
        })
        .catch((error) => {
          toast.error("Something went wrong. Please check again!");
          console.error("Error:", error);
        });
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      setFileUpLoad(file);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 2, borderRadius: "10px", maxWidth: "30rem", m: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Create Product
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              {...register("Name", { required: true })}
              fullWidth
              margin="normal"
            />
            {errors.Name && <p>This field is required</p>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Description"
              {...register("Description", { required: true })}
              fullWidth
              margin="normal"
            />
            {errors.Description && <p>This field is required</p>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Unit in Stock"
              {...register("UnitInStock", { required: true })}
              type="number"
              fullWidth
              margin="normal"
            />
            {errors.UnitInStock && <p>This field is required</p>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              {...register("Price", { required: true, validate: validatePrice })}
              type="number"
              fullWidth
              margin="normal"
            />
            {errors.Price && <p>This field is required</p>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker", "DatePicker"]}>
                <DatePicker label="Expired Date" defaultValue={dayjs(today)} />
              </DemoContainer>
            </LocalizationProvider>
            {errors.expiredDate && <p>This field is required</p>}
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                {...register("Status", { required: true })}
                label="Status"
                defaultValue="1"
              >
                <MenuItem value="1">Active</MenuItem>
                <MenuItem value="0">Inactive</MenuItem>
              </Select>
            </FormControl>
            {errors.Status && <p>This field is required</p>}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Image URL"
              type="file"
              onChange={onFileInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
            />
            {errors.imgUrl && <p>This field is required</p>}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ m: "auto" }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CreateProductPage;
