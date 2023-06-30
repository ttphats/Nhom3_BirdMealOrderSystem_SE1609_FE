import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Product } from "../modules/Product/models";
import productApi from "../modules/Product/apis/productApi";
import { toast } from "react-toastify";
import comboApi from "../modules/Combo/apis/comboApi";
import { BirdSpecies, CreateComboForm } from "../modules/Combo/models";
import { FieldError, useForm } from "react-hook-form";

const CreateComboPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [birdSpecies, setBirdSpecies] = useState<BirdSpecies[]>([]);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openBirdSpeciesDialog, setOpenBirdSpeciesDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<
    { productId: number; quantity: number }[]
  >([]);
  const [selectedBirdSpecies, setSelectedBirdSpecies] = useState<number[]>([]);

  const validateName = (value: string) => {
    const words = value.split(" ");
    const isInvalid = words.some((word) => !/^[A-Z]/.test(word));
    if (isInvalid) {
      return "Each word must start with an uppercase letter";
    }
    return true;
  };

  useEffect(() => {
    fetchProductOptions();
    fetchBirdSpeciesOptions();
  }, []);

  const fetchProductOptions = () => {
    productApi
      .fetch()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: any) => {
        const products = response.data;
        setProducts(products);
      })
      .catch((err) => console.log(err));
  };

  const fetchBirdSpeciesOptions = () => {
    comboApi
      .getBird()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: any) => {
        const birdSpecies = response.data;
        setBirdSpecies(birdSpecies);
      })
      .catch((err) => console.log(err));
  };

  const handleProductDialogOpen = () => {
    setOpenProductDialog(true);
  };

  const handleProductDialogClose = () => {
    setOpenProductDialog(false);
  };

  const handleBirdSpeciesDialogOpen = () => {
    setOpenBirdSpeciesDialog(true);
  };

  const handleBirdSpeciesDialogClose = () => {
    setOpenBirdSpeciesDialog(false);
  };

  const handleProductSelection = (productId: number, quantity: number) => {
    if (selectedProducts.some((product) => product.productId === productId)) {
      setSelectedProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === productId ? { ...product, quantity } : product
        )
      );
    } else {
      setSelectedProducts((prevProducts) => [
        ...prevProducts,
        { productId: productId, quantity },
      ]);
    }
  };

  const handleBirdSpeciesSelection = (speciesId: number) => {
    if (selectedBirdSpecies.includes(speciesId)) {
      setSelectedBirdSpecies(
        selectedBirdSpecies.filter((id) => id !== speciesId)
      );
    } else {
      setSelectedBirdSpecies([...selectedBirdSpecies, speciesId]);
    }
  };

  const renderSelectedProducts = () => {
    return selectedProducts.map((product) => {
      const productData = products.find((p) => p.id === product.productId);
      if (productData) {
        return (
          <TableRow key={productData.id}>
            <TableCell>{productData.name}</TableCell>
            <TableCell>
              <TextField
                type="number"
                value={product.quantity}
                onChange={(e) =>
                  handleProductSelection(
                    product.productId,
                    parseInt(e.target.value, 10)
                  )
                }
              />
            </TableCell>
          </TableRow>
        );
      }
      return null;
    });
  };

  const renderSelectedBirdSpecies = () => {
    return selectedBirdSpecies.map((speciesId) => {
      const species = birdSpecies.find((s) => s.id === speciesId);
      if (species) {
        return (
          <TableRow key={species.id}>
            <TableCell>{species.name}</TableCell>
          </TableRow>
        );
      }
      return null;
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    if (fileUpload) {
      const selectedProductsData = products
        .filter((product) =>
          selectedProducts.find((p) => p.productId === product.id)
        )
        .map((product) => ({
          productId: product.id,
          quantity:
            selectedProducts.find((p) => p.productId === product.id)
              ?.quantity || 1,
        }));

        const payload: CreateComboForm = {
            form: {
              Name: data.Name,
              Status: data.Status,
              ComboProducts: selectedProductsData,
              BirdSpecies: selectedBirdSpecies.map((speciesId) => ({ id: speciesId })),
            },
            imageFile: fileUpload,
          };

      const formData = new FormData();
      formData.append("form", JSON.stringify(payload.form));
      formData.append("imageFile", fileUpload);

      comboApi
        .create(formData)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) => {
          toast.success(response.message);
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
    }
  };

  return (
    <>
      <Dialog open={openProductDialog} onClose={handleProductDialogClose}>
        <DialogTitle>Select Combo Products</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleProductSelection(product.id, 1)}
                      >
                        {selectedProducts.some(
                          (selectedProduct) =>
                            selectedProduct.productId === product.id
                        )
                          ? "Deselect"
                          : "Select"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProductDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openBirdSpeciesDialog}
        onClose={handleBirdSpeciesDialogClose}
      >
        <DialogTitle>Select Bird Species</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {birdSpecies.map((species) => (
                  <TableRow key={species.id}>
                    <TableCell>{species.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleBirdSpeciesSelection(species.id)}
                      >
                        {selectedBirdSpecies.includes(species.id)
                          ? "Deselect"
                          : "Select"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBirdSpeciesDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Paper
        elevation={3}
        sx={{ p: 2, borderRadius: "10px", maxWidth: "30rem", m: 2 }}
      >
        <DialogTitle>Create Combo</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Name"
                {...register("Name", {
                  required: true,
                  validate: validateName,
                })}
                fullWidth
                margin="normal"
              />
              {errors.Name && (
                <p style={{ color: "red" }}>
                  {(errors.Name as FieldError)?.message ||
                    "This field is required"}
                </p>
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleProductDialogOpen}
              >
                Select Combo Products
              </Button>
              <TableContainer>
                <Table>
                  <TableBody>{renderSelectedProducts()}</TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleBirdSpeciesDialogOpen}
              >
                Select Bird Species
              </Button>
              <TableContainer>
                <Table>
                  <TableBody>{renderSelectedBirdSpecies()}</TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  {...register("Status", { required: true })}
                  defaultValue="1"
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
              {errors.imgUrl && <p>This field is required</p>}
            </Grid>
            <Grid item xs={12} sm={6} sx={{ m: "auto" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
};

export default CreateComboPage;
