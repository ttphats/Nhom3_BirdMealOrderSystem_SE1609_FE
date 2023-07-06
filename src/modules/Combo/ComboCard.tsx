import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import DifferenceIcon from '@mui/icons-material/Difference';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Combo } from "./models";
import { useAppSelector } from "../../redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import AppRoutes from "../../router/AppRoutes";
import comboApi from "./apis/comboApi";
import { toast } from "react-toastify";
import { useState } from "react";

type Props = {
  item: Combo;
  handleAddToCart: (clickedItem: Combo) => void;
};

export default function ComboCard({ item, handleAddToCart }: Props) {
  const user = useAppSelector((state) => state.profile.user.data);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const handleDelete = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = (id: number) => {
    comboApi
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
      <Link
        to={{
          pathname: `/ComboDetails/${item.id}`,
        }}
      >
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
        <CardContent sx={{ color: "#fff", textAlign: "left" }}>
          <Typography
            gutterBottom
            variant="body2"
            component="div"
            sx={{
              fontSize: "14px",
              lineHeight: "20px",
              maxHeight: "40px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              "-webkit-line-clamp": 2,
              "-webkit-box-orient": "vertical",
            }}
          >
            {item.description}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#69ec69", fontWeight: 700 }}
          >
            {item.price.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
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
          <Link to={`/duplicateCombo/${item.id}`}>
            <IconButton aria-label="share" sx={{ color: "lightpink" }}>
              <DifferenceIcon />
            </IconButton>
          </Link>
          <Link to={`/editCombo/${item.id}`}>
            <IconButton aria-label="share" sx={{ color: "lightgreen" }}>
              <EditIcon />
            </IconButton>
          </Link>
        </CardActions>
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
        <DialogTitle>Confirm to delete <strong>{item?.name}</strong></DialogTitle>
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
