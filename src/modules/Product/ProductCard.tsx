import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import CircleIcon from "@mui/icons-material/Circle";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Box, Typography, styled } from "@mui/material";
import { Product } from "./models";
import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../router/AppRoutes";

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
  return (
    <Card
      sx={{
        width: "270px",
        height: "390px",
        position: "relative",
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
          textOverflow: "ellipsis",
        }}
      >
        <Typography
          gutterBottom
          variant="body1"
          component="div"
          sx={{ fontSize: "14px " }}
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
        }}
      >
        <Typography variant="body1" sx={{ color: "#69ec69", fontWeight: 700 }}>
          {item.price.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })}
        </Typography>
        <Typography variant="body2" sx={{ color: "#fff", textAlign: "left" }}>
          Unit In Stock: {item.unitInStock}
        </Typography>
        <Typography variant="body2" sx={{ color: "#fff", textAlign: "left" }}>
          Expired Date: {item.expiredDate}
        </Typography>
      </CardContent>
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
      {user.role == "Customer" ||
        (!user.role && (
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
        ))}
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
    </Card>
  );
}
