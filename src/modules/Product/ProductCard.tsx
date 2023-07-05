import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import CircleIcon from "@mui/icons-material/Circle";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
  styled,
} from "@mui/material";
import { Product } from "./models";
import { useAppSelector } from "../../redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import AppRoutes from "../../router/AppRoutes";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import productApi from "./apis/productApi";
import { toast } from "react-toastify";

type Props = {
  item: Product;
  handleAddToCart: (clickedItem: Product) => void;
};

const StyledInfo = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  marginTop: theme.spacing(1),
  color: theme.palette.text.disabled,
}));

export default function ProductCard({ item, handleAddToCart }: Props) {
  const user = useAppSelector((state) => state.profile.user.data);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const handleDelete = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = (id: number) => {
    productApi
      .delete(id)
      .then(() => {
        toast.success("Delete successfully");
        setOpenDialog(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };
  return (
    <Card
      sx={{
        width: "270px",
        height: "390px",
        backgroundColor: "#272d40",
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "0.2s",
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      <Link to={`/ProductDetails/${item.id}`}>
        <CardMedia
          component="img"
          height="194"
          image={item.imgUrl}
          alt={item.name}
        />
        <Box
          sx={{
            width: "200px",
            height: "auto",
            border: 3,
            borderColor: "#fff",
            borderRadius: 3,
            backgroundColor: "#282d3e",
            color: "#fff",
            m: "auto",
            position: "relative",
            transform: "translateY(-50%)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          <Typography
            gutterBottom
            variant="body1"
            component="div"
            sx={{ fontSize: "14px" }}
          >
            {item.name}
          </Typography>
        </Box>
        <CardContent
          sx={{
            color: "#fff",
            textAlign: "left",
            p: 0,
            marginLeft: 2,
            position: "relative",
            bottom: "25px",
            mt: 1,
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: "#69ec69", fontWeight: 700 }}
          >
            {item.price.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </Typography>
          <Typography variant="body2" sx={{ color: "#fff", textAlign: "left" }}>
            Unit In Stock: {item.unitInStock}
          </Typography>
          <Typography variant="body2" sx={{ color: "#fff", textAlign: "left" }}>
            Expired Date:{" "}
            {(item?.expiredDate &&
              new Date(item.expiredDate).toLocaleDateString("vi-VN")) ||
              "N/A"}
          </Typography>
        </CardContent>
      </Link>

      {/* Staff Action Block */}
      {user.role == "Staff" && (
        <CardActions
          disableSpacing
          sx={{
            display: "flex",
            justifyContent: "space-between",
            bottom: 0,
          }}
        >
          <IconButton
            aria-label="add to favorites"
            sx={{ color: "red" }}
            onClick={handleDelete}
          >
            <DeleteForeverIcon />
          </IconButton>
          <Link to={`/editProduct/${item.id}`}>
            <IconButton aria-label="share" sx={{ color: "lightgreen" }}>
              <EditIcon />
            </IconButton>
          </Link>
        </CardActions>
      )}

      {item.status == "Active" && user.role == "Staff" ? (
        <StyledInfo
          sx={{
            justifyContent: "flex-end",
            position: "relative",
            bottom: "15px",
          }}
        >
          <Box
            key={item.id}
            sx={{
              display: "flex",
              alignItems: "center",
              marginRight: 2,
              bottom: 1,
            }}
          >
            <CircleIcon
              sx={{ width: 16, height: 16, mr: 0.5, color: "lightgreen" }}
            />
            <Typography sx={{ color: "lightgreen" }} variant="caption">
              Active
            </Typography>
          </Box>
        </StyledInfo>
      ) : (
        <></>
      )}
      {item.status == "OutOfStock" && user.role == "Staff" ? (
        <StyledInfo
          sx={{
            justifyContent: "flex-end",
            position: "relative",
            bottom: "15px",
          }}
        >
          <Box
            key={item.id}
            sx={{
              display: "flex",
              alignItems: "center",
              marginRight: 2,
              bottom: 1,
            }}
          >
            <CircleIcon sx={{ width: 16, height: 16, mr: 0.5, color: "red" }} />
            <Typography sx={{ color: "red" }} variant="caption">
              OutOfStock
            </Typography>
          </Box>
        </StyledInfo>
      ) : (
        <></>
      )}
      {/* Customer Action Block */}
      {user.role == "Customer" && (
        <CardActions
          disableSpacing
          sx={{
            display: "flex",
            justifyContent: "space-between",
            bottom: 0,
          }}
        >
          <IconButton aria-label="add to favorites" sx={{ color: "#fff" }}>
            <FavoriteIcon />
          </IconButton>
          <IconButton
            aria-label="share"
            sx={{ color: "#fff" }}
            onClick={() => handleAddToCart(item)}
          >
            <AddShoppingCartIcon />
          </IconButton>
        </CardActions>
      )}
      {/* Guest Action Block */}
      {!user.role && (
        <CardActions
          disableSpacing
          sx={{
            display: "flex",
            justifyContent: "space-between",
            bottom: 0,
          }}
        >
          <IconButton aria-label="add to favorites" sx={{ color: "#fff" }}>
            <FavoriteIcon />
          </IconButton>
          <IconButton
            aria-label="share"
            sx={{ color: "#fff" }}
            onClick={() => navigate(AppRoutes.login, { replace: true })}
          >
            <AddShoppingCartIcon />
          </IconButton>
        </CardActions>
      )}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>
          Confirm to delete <strong>{item?.name}</strong>
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={() => handleConfirmDelete(item.id)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
