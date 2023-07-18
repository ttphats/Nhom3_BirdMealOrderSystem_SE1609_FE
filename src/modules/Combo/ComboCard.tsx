import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import DifferenceIcon from "@mui/icons-material/Difference";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
  styled,
} from "@mui/material";
import { Combo } from "./models";
import { useAppSelector } from "../../redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import AppRoutes from "../../router/AppRoutes";
import comboApi from "./apis/comboApi";
import { toast } from "react-toastify";
import { useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

type Props = {
  item: Combo;
  handleAddToCart: (clickedItem: Combo) => void;
};

const StyledInfo = styled("div")(() => ({
  display: "flex",
  justifyContent: "flex-end",
}));

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
        window.location.reload();
        toast.success("Huỷ kích hoạt combo thành công");
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
        height: "420px",
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
      {item.status == "Active" &&
      (user.role == "Staff" || user.role == "Admin") ? (
        <StyledInfo>
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
      {item.status == "OutOfStock" &&
      (user.role == "Staff" || user.role == "Admin") ? (
        <StyledInfo>
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
              sx={{ width: 16, height: 16, mr: 0.5, color: "orange" }}
            />
            <Typography sx={{ color: "red" }} variant="caption">
              OutOfStock
            </Typography>
          </Box>
        </StyledInfo>
      ) : (
        <></>
      )}
      {item.status == "InActive" &&
      (user.role == "Staff" || user.role == "Admin") ? (
        <StyledInfo>
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
              InActive
            </Typography>
          </Box>
        </StyledInfo>
      ) : (
        <></>
      )}

      {/* Staff Action Block */}
      <CardActions
        disableSpacing
        sx={{
          display: "flex",
          justifyContent: "space-between",
          bottom: 0,
        }}
      >
        {(user.role == "Staff" || user.role == "Admin") &&
          item.status != "InActive" && (
            <IconButton sx={{ color: "orange" }} onClick={handleDelete}>
              <ChangeCircleIcon />
            </IconButton>
          )}
        {(user.role == "Staff" || user.role == "Admin") && (
          <>
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
          </>
        )}
      </CardActions>
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
          Xác nhận huỷ kích hoạt <strong>{item?.name}</strong>
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={() => handleConfirmDelete(item.id)}
            variant="contained"
            color="error"
          >
            InActive
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
