import React, { useEffect, useState } from "react";
import {
  Button,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { CreateProductForm, Product } from "../modules/Product/models";
import productApi from "../modules/Product/apis/productApi";
import { toast } from "react-toastify";
import { Controller, FieldError, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../router/AppRoutes";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useAppSelector } from "../redux/hooks";

dayjs.extend(utc);

const EditProductPage = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const { id } = useParams();
  const [productData, setProductData] = useState<Product>();
  const [nameValue, setNameValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [unitInStockValue, setUnitInStockValue] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [expiredDateValue, setExpiredDateValue] = useState<Date | null>(
    new Date()
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.profile.user.data);

  const fetchProductData = async () => {
    if (id) {
      const productId = parseInt(id, 10);
      if (user.id != '') {
        await productApi
          .getDetailsForAuth(productId)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((response: any) => {
            const product = response.data;
            setProductData(product);
            setNameValue(product?.name || "");
            setDescriptionValue(product?.description || "");
            setUnitInStockValue(product?.unitInStock);
            setPriceValue(product?.price);
            setExpiredDateValue(product?.expiredDate || null);
            setImagePreview(product?.imgUrl || null);
          })
          .catch((err) => console.log(err));
      } else {
        await productApi
          .getDetails(productId)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((response: any) => {
            const product = response.data;
            setProductData(product);
            setNameValue(product?.name || "");
            setDescriptionValue(product?.description || "");
            setUnitInStockValue(product?.unitInStock);
            setPriceValue(product?.price);
            setExpiredDateValue(product?.expiredDate || null);
            setImagePreview(product?.imgUrl || null);
          })
          .catch((err) => console.log(err));
      }
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const formattedExpiredDateValue = expiredDateValue
    ? dayjs(expiredDateValue).local()
    : null;

  const validateName = (value: string) => {
    if (value === productData?.name || !value.trim()) {
      return true;
    } else {
      const words = value.split(" ");
      const isInvalid = words.some((word) => !/^[A-Z]/.test(word));
      if (isInvalid) {
        return "Each word must start with an uppercase letter";
      }
    }
    return true;
  };

  const validateDescription = (value: string) => {
    if (value === productData?.description || !value.trim()) {
      return true;
    }
    return "This field is required";
  };

  const validateUnitInStock = (value: string) => {
    if (value === productData?.unitInStock.toString() || !value.trim()) {
      return true;
    }
  };

  const validatePrice = (value: string) => {
    if (value === productData?.price.toString() || !value.trim()) {
      return true;
    }
    return (
      parseInt(value, 10) >= 500 || "Price must be greater than or equal to 500"
    );
  };

  const validateExpiredDate = (value: Date | null | undefined) => {
    if (value === null || (value && productData?.expiredDate)) {
      return true;
    }
  
    if (value) {
      const selectedDate = dayjs(value).startOf("day"); // Use local time
      const currentDate = dayjs().startOf("day");
  
      if (selectedDate.isAfter(currentDate)) {
        return true;
      } else {
        return "Expired Date must be greater than today";
      }
    }
  
    return true;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    if (!fileUpload && imagePreview) {
      setFileUpload(null);
    }
    const payload: CreateProductForm = {
      form: {
        Name: data.Name || productData?.name,
        Description: data.Description || productData?.description,
        Status: data.Status,
        UnitInStock: data.UnitInStock || productData?.unitInStock,
        Price: data.Price || productData?.price,
        ExpiredDate: data.ExpiredDate || productData?.expiredDate,
      },
      imageFile: fileUpload,
    };

    console.log(payload);

    const formData = new FormData();
    formData.append("form", JSON.stringify(payload.form));
    if (fileUpload) {
      formData.append("imageFile", fileUpload);
    }

    if (id) {
      const productId = parseInt(id, 10);

      productApi
        .update(formData, productId)
        .then(() => {
          toast.success("Updated product success");
          navigate(AppRoutes.product, { replace: true });
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
      setFileUpload(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const normalizedDate = expiredDateValue ? dayjs.utc(expiredDateValue).local() : null;
    if (normalizedDate) {
      setValue("ExpiredDate", normalizedDate.toDate());
    }
  }, [expiredDateValue, setValue]);

  return (
    <>
      <Paper
        elevation={3}
        sx={{ p: 2, borderRadius: "10px", maxWidth: "30rem", m: 2 }}
      >
        <DialogTitle>Edit Product</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Name"
                {...register("Name", {
                  validate: validateName,
                  required: errors.Name ? true : false,
                })}
                fullWidth
                margin="normal"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
              />
              {errors.Name && (
                <p style={{ color: "red" }}>
                  {(errors.Name as FieldError)?.message ||
                    "This field is required"}
                </p>
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Description"
                {...register("Description", {
                  validate: validateDescription,
                  required: errors.Description ? true : false,
                })}
                fullWidth
                multiline
                margin="normal"
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
              />
              {errors.Description && (
                <p style={{ color: "red" }}>
                  {(errors.Description as FieldError)?.message ||
                    "This field is required"}
                </p>
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="UnitInStock"
                {...register("UnitInStock", {
                  validate: validateUnitInStock,
                  required: errors.UnitInStock ? true : false,
                })}
                fullWidth
                multiline
                margin="normal"
                value={unitInStockValue}
                onChange={(e) => setUnitInStockValue(e.target.value)}
              />
              {errors.UnitInStock && (
                <p style={{ color: "red" }}>
                  {(errors.UnitInStock as FieldError)?.message ||
                    "This field is required"}
                </p>
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Price"
                {...register("Price", {
                  validate: validatePrice,
                  required: errors.Price ? true : false,
                })}
                fullWidth
                multiline
                margin="normal"
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
              />
              {errors.Price && (
                <p style={{ color: "red" }}>
                  {(errors.Price as FieldError)?.message ||
                    "This field is required"}
                </p>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  control={control}
                  name="ExpiredDate"
                  defaultValue={formattedExpiredDateValue}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Expired Date"
                      value={field.value ? dayjs.utc(field.value) : null}
                      shouldDisableDate={(day) => dayjs().isAfter(day)}
                    />
                  )}
                  rules={{
                    validate: validateExpiredDate,
                  }}
                />
              </LocalizationProvider>
              {errors.ExpiredDate && (
                <p style={{ color: "red" }}>
                  {(errors.ExpiredDate as FieldError)?.message ||
                    "This field is required"}
                </p>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  {...register("Status", { required: true })}
                  defaultValue={productData?.status.toString() || "1"}
                >
                  <MenuItem value="1">Active</MenuItem>
                  <MenuItem value="0">Inactive</MenuItem>
                </Select>
              </FormControl>
              {errors.Status && (
                <p style={{ color: "red" }}>This field is required</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="file"
                onChange={onFileInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  style={{ width: "100%", marginTop: "10px" }}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6} sx={{ m: "auto" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
};

export default EditProductPage;
