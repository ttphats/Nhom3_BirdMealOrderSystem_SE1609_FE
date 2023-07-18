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
import { BirdSpecies, Combo, CreateComboForm } from "../modules/Combo/models";
import { FieldError, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../router/AppRoutes";
import { useAppSelector } from "../redux/hooks";

const EditComboPage = () => {
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
  const { id } = useParams();
  const [comboData, setComboData] = useState<Combo>();
  const [nameValue, setNameValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.profile.user.data);

  const fetchComboData = async () => {
    if (id) {
      const comboId = parseInt(id, 10);
      if(user.id != ''){
        await comboApi
        .getDetailsForAuth(comboId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) => {
          const combo = response.data;
          setComboData(combo);
          setNameValue(combo?.name || "");
          setDescriptionValue(combo?.description || "");
          setImagePreview(combo?.imgUrl || null);
          setSelectedProducts(
            combo?.products.map((product: Product) => ({
              productId: product.id,
              quantity: parseInt(product.quantity, 10),
            })) || []
          );
          setSelectedBirdSpecies(
            combo?.birdSpecies.map((bird: BirdSpecies) => bird.id) || []
          );
        })
        .catch((err) => console.log(err));
      } else {
        await comboApi
        .getDetails(comboId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) => {
          const combo = response.data;
          setComboData(combo);
          setNameValue(combo?.name || "");
          setDescriptionValue(combo?.description || "");
          setImagePreview(combo?.imgUrl || null);
          setSelectedProducts(
            combo?.products.map((product: Product) => ({
              productId: product.id,
              quantity: parseInt(product.quantity, 10),
            })) || []
          );
          setSelectedBirdSpecies(
            combo?.birdSpecies.map((bird: BirdSpecies) => bird.id) || []
          );
        })
        .catch((err) => console.log(err));
      }
    }
  };

  useEffect(() => {
    fetchComboData();
  }, [id]);

  const validateName = (value: string) => {
    if (value === comboData?.name || !value.trim()) {
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
    if (value === comboData?.description || !value.trim()) {
      return true;
    }
    return "This field is required";
  };

  useEffect(() => {
    fetchProductOptions();
    fetchBirdSpeciesOptions();
  }, []);

  const fetchProductOptions = () => {
    productApi
      .fetchAll()
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
        setSelectedBirdSpecies(birdSpecies);
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
    const isSelected = selectedProducts.some(
      (product) => product.productId === productId
    );

    if (isSelected) {
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
    if (!fileUpload && imagePreview) {
      setFileUpload(null);
    }

    let selectedProductsData: { productId: number; quantity: number }[] = [];
    let selectedBirdsData: { id: number }[] = [];

    if (selectedProducts.length) {
      selectedProductsData = selectedProducts.map((selectedProduct) => ({
        productId: selectedProduct.productId,
        quantity: selectedProduct.quantity || 1,
      }));
    }

    if (selectedBirdSpecies.length) {
      selectedBirdsData = selectedBirdSpecies.map((id) => ({
        id: id,
      }));
    }

    const payload: CreateComboForm = {
      form: {
        Name: data.Name || comboData?.name,
        Description: data.Description || comboData?.description,
        Status: data.Status,
        ComboProducts: selectedProductsData,
        BirdSpecies: selectedBirdsData,
      },
      imageFile: fileUpload,
    };

    const formData = new FormData();
    formData.append("form", JSON.stringify(payload.form));
    if (fileUpload) {
      formData.append("imageFile", fileUpload);
    }

    if (id) {
      const comboId = parseInt(id, 10);

      comboApi
        .update(formData, comboId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) => {
          toast.success(response.message);
          navigate(AppRoutes.combo, { replace: true });
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

  console.log(selectedProducts);
  console.log(selectedBirdSpecies);

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
        <DialogTitle>Edit Combo</DialogTitle>
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
                <TableBody>{renderSelectedBirdSpecies()}</TableBody>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  {...register("Status", { required: true })}
                  defaultValue={comboData?.status.toString() || "1"}
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
              {imagePreview && ( // Render image preview if available
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

export default EditComboPage;
