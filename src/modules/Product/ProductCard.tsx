import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Box, LinearProgress, Typography } from "@mui/material";
import { Product } from "./models";

type Props = {
  item: Product;
  handleAddToCart: (clickedItem: Product) => void;
};

export default function ProductCard({
  item,
  handleAddToCart,
}: Props) {
  return (
    <Card
      sx={{
        width: "260px",
        height: "350px",
        backgroundColor: "#272d40",
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
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
          overflow: "hidden",
        }}
      >
        <Typography
          noWrap
          gutterBottom
          variant="body1"
          component="div"
          sx={{ fontSize: "14px " }}
        >
          {item.name}
        </Typography>
      </Box>
      <CardContent sx={{ color: "#fff", textAlign: "left", p: 2, pt: 0 }}>
        <Typography variant="body1" sx={{ color: "#69ec69", fontWeight: 700 }}>
          {item.price.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })}
        </Typography>
      </CardContent>
      <Box sx={{ width: "90%", pl: 2, pr: 2 }}>
        <Typography variant="body2" sx={{ color: "#fff", textAlign: "left" }}>
          Ordered quantity: 20/100
        </Typography>
        <LinearProgress variant="determinate" value={20} />
      </Box>
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
    </Card>
  );
}